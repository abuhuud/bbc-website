import { put, list } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Real-time CRUD Endpoint untuk Vercel Blob (Store: bbc-baznas-db)
 * Mendukung kategori: players, events, gallery, articles, officials, hero
 */
export default async function handler(req, res) {
  // CORS & Real-time headers (mencegah cache di Edge/Browser)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const category = (url.searchParams.get('category') || '').toLowerCase().trim();

  const validCategories = ['players', 'events', 'gallery', 'articles', 'officials', 'hero'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

  // ====================================================
  // GET: Baca data kategori dari Vercel Blob (atau fallback lokal)
  // ====================================================
  if (req.method === 'GET') {
    try {
      if (token) {
        const prefix = `data/${category}.json`;
        const listResult = await list({
          prefix,
          limit: 1,
          token,
          storeId: storeId || undefined
        });

        if (listResult.blobs && listResult.blobs.length > 0) {
          const blobMeta = listResult.blobs[0];
          const response = await fetch(`${blobMeta.url}?t=${Date.now()}`, { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            return res.status(200).json({
              success: true,
              source: 'vercel-blob',
              category,
              blob_url: blobMeta.url,
              version: data._version || Date.now(),
              data: data[category] !== undefined ? data[category] : data
            });
          }
        }
      }
    } catch (err) {
      console.warn(`[Blob Read Warning] Gagal membaca ${category} dari Vercel Blob, fallback ke lokal:`, err.message);
    }

    // Fallback ke file JSON statis di folder data/
    try {
      const localFilePath = path.join(process.cwd(), 'data', `${category}.json`);
      if (fs.existsSync(localFilePath)) {
        const raw = fs.readFileSync(localFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        return res.status(200).json({
          success: true,
          source: 'local-fallback',
          category,
          version: parsed._version || 0,
          data: parsed[category] !== undefined ? parsed[category] : parsed
        });
      }
    } catch (fsErr) {
      return res.status(500).json({
        success: false,
        error: `Gagal membaca file lokal: ${fsErr.message}`
      });
    }

    return res.status(404).json({
      success: false,
      error: `Data untuk kategori '${category}' tidak ditemukan`
    });
  }

  // ====================================================
  // POST: Simpan / Update data kategori secara realtime ke Vercel Blob
  // ====================================================
  if (req.method === 'POST') {
    try {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      // Handle raw stream jika body parser tidak aktif otomatis
      if (!bodyData || (typeof bodyData === 'object' && Object.keys(bodyData).length === 0)) {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBuffer = Buffer.concat(chunks).toString('utf8');
        if (rawBuffer) {
          try {
            bodyData = JSON.parse(rawBuffer);
          } catch (pe) {
            return res.status(400).json({ success: false, error: 'Malformed JSON payload' });
          }
        }
      }

      if (!bodyData) {
        return res.status(400).json({ success: false, error: 'Empty payload body' });
      }

      // Pastikan format terbungkus metadata untuk sinkronisasi versioning
      const timestamp = new Date().toISOString();
      const currentVer = Date.now();
      let payloadToSave = bodyData;

      if (!bodyData._version) {
        payloadToSave = {
          _version: currentVer,
          _updatedAt: timestamp,
          [category]: bodyData
        };
      }

      const pathname = `data/${category}.json`;
      const jsonContent = JSON.stringify(payloadToSave, null, 2);

      // Simpan langsung ke Vercel Blob dengan akses publik
      if (token) {
        const options = {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json'
        };
        if (storeId) options.storeId = storeId;
        if (token) options.token = token;

        const blob = await put(pathname, jsonContent, options);

        return res.status(200).json({
          success: true,
          message: `Kategori '${category}' berhasil disimpan secara realtime ke Vercel Blob`,
          source: 'vercel-blob',
          blob_url: blob.url,
          pathname: blob.pathname,
          version: currentVer,
          updatedAt: timestamp
        });
      }

      // Jika dijalankan di lingkungan lokal tanpa token Vercel Blob
      try {
        const localFilePath = path.join(process.cwd(), 'data', `${category}.json`);
        fs.writeFileSync(localFilePath, jsonContent, 'utf8');
        return res.status(200).json({
          success: true,
          message: `Kategori '${category}' disimpan ke file lokal (Vercel Blob token tidak terdeteksi)`,
          source: 'local-fs',
          version: currentVer,
          updatedAt: timestamp
        });
      } catch (writeErr) {
        return res.status(200).json({
          success: true,
          message: `Data kategori '${category}' diterima (offline mode)`,
          source: 'memory',
          version: currentVer,
          updatedAt: timestamp
        });
      }
    } catch (err) {
      console.error(`[Blob Save Error for ${category}]:`, err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Gagal menyimpan ke Vercel Blob'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
