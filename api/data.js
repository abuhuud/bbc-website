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

      // 1. Coba simpan langsung ke file lokal data/*.json (jika filesystem writable / lingkungan lokal / dev)
      let localWritten = false;
      try {
        const localFilePath = path.join(process.cwd(), 'data', `${category}.json`);
        fs.writeFileSync(localFilePath, jsonContent, 'utf8');
        localWritten = true;
      } catch (fsErr) {
        // Lingkungan read-only lambda di Vercel cloud
      }

      // 2. Simpan ke Vercel Blob jika token tersedia (Cloud Real-time persistence di Vercel)
      let blobSaved = false;
      let blobInfo = null;
      if (token) {
        try {
          const options = {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'application/json'
          };
          if (storeId) options.storeId = storeId;
          if (token) options.token = token;

          const blob = await put(pathname, jsonContent, options);
          blobSaved = true;
          blobInfo = { url: blob.url, pathname: blob.pathname };
        } catch (bErr) {
          console.error(`[Blob Save Error for ${category}]:`, bErr.message);
        }
      }

      // 3. Jika tersedia token GitHub di Environment Variables, commit langsung ke repository remote
      let githubSynced = false;
      const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      if (ghToken) {
        try {
          const repoOwner = process.env.GITHUB_REPO_OWNER || 'abuhuud';
          const repoName = process.env.GITHUB_REPO_NAME || 'bbc-website';
          const branch = process.env.GITHUB_BRANCH || 'main';
          const ghPath = `data/${category}.json`;

          let currentSha = null;
          const getRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${ghPath}?ref=${branch}`, {
            headers: {
              'Authorization': `token ${ghToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'BBC-Website-CMS'
            }
          });
          if (getRes.ok) {
            const fileMeta = await getRes.json();
            currentSha = fileMeta.sha;
          }

          const putRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${ghPath}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${ghToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'BBC-Website-CMS'
            },
            body: JSON.stringify({
              message: `CMS: update data/${category}.json [skip ci]`,
              content: Buffer.from(jsonContent, 'utf8').toString('base64'),
              branch,
              sha: currentSha || undefined
            })
          });
          if (putRes.ok) {
            githubSynced = true;
          }
        } catch (ghErr) {
          console.warn(`[GitHub Push Warning for ${category}]:`, ghErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: `Kategori '${category}' berhasil disimpan langsung ke file .json dan Vercel`,
        category,
        version: currentVer,
        updatedAt: timestamp,
        localWritten,
        blobSaved,
        blobInfo,
        githubSynced
      });
    } catch (err) {
      console.error(`[Save Error for ${category}]:`, err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Gagal menyimpan data kategori'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
