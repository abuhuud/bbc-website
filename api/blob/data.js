import { put, list } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Endpoint CRUD Data JSON ke Vercel Blob (bbc-baznas-db)
 * Mendukung kategori: players, events, gallery, articles, officials, hero
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

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
          const response = await fetch(blobMeta.url);
          if (response.ok) {
            const data = await response.json();
            return res.status(200).json({
              success: true,
              source: 'vercel-blob',
              category,
              blob_url: blobMeta.url,
              data
            });
          }
        }
      }
    } catch (err) {
      console.warn(`[Blob Read Warning] Failed reading ${category} from Vercel Blob, falling back to local:`, err.message);
    }

    // Fallback ke file lokal di folder data/
    try {
      const localFilePath = path.join(process.cwd(), 'data', `${category}.json`);
      if (fs.existsSync(localFilePath)) {
        const raw = fs.readFileSync(localFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        return res.status(200).json({
          success: true,
          source: 'local-fallback',
          category,
          data: parsed[category] || parsed
        });
      }
    } catch (fsErr) {
      return res.status(500).json({
        success: false,
        error: `Failed to read local fallback: ${fsErr.message}`
      });
    }

    return res.status(404).json({
      success: false,
      error: `Data for category '${category}' not found`
    });
  }

  // ====================================================
  // POST: Simpan / Update data kategori ke Vercel Blob
  // ====================================================
  if (req.method === 'POST') {
    try {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      // Handle raw stream jika body parser tidak aktif
      if (!bodyData || (typeof bodyData === 'object' && Object.keys(bodyData).length === 0)) {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBuffer = Buffer.concat(chunks).toString('utf8');
        if (rawBuffer) {
          bodyData = JSON.parse(rawBuffer);
        }
      }

      if (!bodyData) {
        return res.status(400).json({ success: false, error: 'Empty payload body' });
      }

      const pathname = `data/${category}.json`;
      const jsonContent = JSON.stringify(bodyData, null, 2);

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
        message: `Category '${category}' successfully saved to Vercel Blob bbc-baznas-db`,
        blob_url: blob.url,
        pathname: blob.pathname,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(`[Blob Save Error for ${category}]:`, err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to save to Vercel Blob'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
