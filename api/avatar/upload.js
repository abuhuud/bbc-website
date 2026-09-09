import { put } from '@vercel/blob';

/**
 * Endpoint Upload Avatar / Media ke Vercel Blob
 * Store: bbc-baznas-db (storeId: process.env.db_STORE_ID)
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
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let filename = url.searchParams.get('filename') || `avatar-${Date.now()}.jpg`;
    filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    // Folder prefix (misal 'avatars/' atau 'media/')
    const folder = url.searchParams.get('folder') || 'avatars';
    const blobPath = `${folder}/${filename}`;

    const requestedAccess = url.searchParams.get('access') || 'public';
    const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

    const options = {
      access: requestedAccess === 'private' ? 'private' : 'public',
      addRandomSuffix: true
    };
    if (storeId) options.storeId = storeId;
    if (token) options.token = token;

    const blob = await put(blobPath, req, options);

    return res.status(200).json(blob);
  } catch (err) {
    console.error('[Vercel Blob Upload Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to upload to Vercel Blob'
    });
  }
}
