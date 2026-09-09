import { put } from '@vercel/blob';

/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Serverless Upload Endpoint ke Vercel Blob (Public Access CDN)
 * Digunakan oleh CMS untuk upload avatar pemain, dokumentasi galeri, berita, dan pengurus.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let filename = reqUrl.searchParams.get('filename') || `media-${Date.now()}.jpg`;
    filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    // Folder tujuan: 'players', 'gallery', 'news', 'officials', 'hero'
    const folder = (reqUrl.searchParams.get('folder') || 'media').replace(/^\/+|\/+$/g, '');
    const blobPath = `${folder}/${filename}`;

    const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

    if (!token) {
      return res.status(503).json({
        success: false,
        error: 'Vercel Blob token (BLOB_READ_WRITE_TOKEN) belum dikonfigurasi di Environment Variables.'
      });
    }

    const options = {
      access: 'public',
      addRandomSuffix: true
    };
    if (storeId) options.storeId = storeId;
    if (token) options.token = token;

    // Put file stream directly into Vercel Blob
    const { url, pathname, contentType, downloadUrl } = await put(blobPath, req, options);

    return res.status(200).json({
      success: true,
      url,
      pathname,
      contentType,
      downloadUrl: downloadUrl || url,
      uploadedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Vercel Blob Public Upload Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Gagal mengunggah file ke Vercel Blob'
    });
  }
}
