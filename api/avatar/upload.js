import { put } from '@vercel/blob';

/**
 * Endpoint Server Upload ke Vercel Blob (Public Access)
 *
 * Menggunakan pola resmi Vercel Blob Public:
 * const { url } = await put(pathname, body, { access: 'public' });
 */
export default async function handler(req, res) {
  // CORS Headers
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
    let filename = reqUrl.searchParams.get('filename') || `file-${Date.now()}.jpg`;
    filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    // Folder prefix (misal 'articles/', 'players/', 'gallery/', 'avatars/', 'hero/')
    const folder = (reqUrl.searchParams.get('folder') || 'articles').replace(/^\/+|\/+$/g, '');
    const blobPath = `${folder}/${filename}`;

    const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

    const options = {
      access: 'public',
      addRandomSuffix: true
    };
    if (storeId) options.storeId = storeId;
    if (token) options.token = token;

    // Eksekusi put() dengan access: 'public' -> mengambil { url }
    const { url, pathname, contentType, downloadUrl } = await put(blobPath, req, options);

    return res.status(200).json({
      success: true,
      url,
      pathname,
      contentType,
      downloadUrl: downloadUrl || url
    });
  } catch (err) {
    console.error('[Vercel Blob Public Upload Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to upload to Vercel Blob'
    });
  }
}
