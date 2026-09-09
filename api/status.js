import { list } from '@vercel/blob';

/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Status & Health Endpoint untuk Vercel Blob (bbc-baznas-db)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;
  const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;

  if (!token) {
    return res.status(200).json({
      success: true,
      connected: false,
      mode: 'local-fallback',
      message: 'Vercel Blob token tidak terdeteksi. Aplikasi menggunakan mode penyimpanan lokal / file JSON.'
    });
  }

  try {
    const listResult = await list({
      limit: 10,
      token,
      storeId: storeId || undefined
    });

    return res.status(200).json({
      success: true,
      connected: true,
      mode: 'vercel-blob-realtime',
      storeName: 'bbc-baznas-db',
      blobsCount: listResult.blobs ? listResult.blobs.length : 0,
      hasMore: listResult.hasMore || false,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      connected: false,
      mode: 'error',
      error: err.message
    });
  }
}
