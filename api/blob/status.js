import { list } from '@vercel/blob';

/**
 * Endpoint Pemeriksaan Status Vercel Blob (bbc-baznas-db)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

  if (!token) {
    return res.status(200).json({
      success: false,
      status: 'unconfigured',
      store: 'bbc-baznas-db',
      error: 'Environment variable BLOB_READ_WRITE_TOKEN belum disetel di Vercel.'
    });
  }

  try {
    const options = { limit: 20 };
    if (token) options.token = token;
    if (storeId) options.storeId = storeId;

    const result = await list(options);

    return res.status(200).json({
      success: true,
      status: 'connected',
      store: 'bbc-baznas-db',
      storeId: storeId || 'default',
      total_blobs: result.blobs?.length || 0,
      blobs: (result.blobs || []).map(b => ({
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
        url: b.url
      }))
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 'error',
      store: 'bbc-baznas-db',
      error: err.message
    });
  }
}
