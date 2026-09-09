import { put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Endpoint One-Click Seeder ke Vercel Blob (bbc-baznas-db)
 * Memigrasikan semua data default JSON ke Vercel Blob Store
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

  if (!token) {
    return res.status(500).json({
      success: false,
      error: 'Environment variable BLOB_READ_WRITE_TOKEN atau db_READ_WRITE_TOKEN belum disetel di Vercel.'
    });
  }

  const categories = ['players', 'events', 'gallery', 'articles', 'officials', 'hero'];
  const results = {};
  const errors = [];

  for (const cat of categories) {
    try {
      const localFilePath = path.join(process.cwd(), 'data', `${cat}.json`);
      if (fs.existsSync(localFilePath)) {
        const raw = fs.readFileSync(localFilePath, 'utf8');
        const parsed = JSON.parse(raw);

        const options = {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json'
        };
        if (storeId) options.storeId = storeId;
        if (token) options.token = token;

        const blob = await put(`data/${cat}.json`, JSON.stringify(parsed, null, 2), options);
        results[cat] = {
          success: true,
          url: blob.url,
          pathname: blob.pathname
        };
      } else {
        errors.push(`File data/${cat}.json not found locally`);
      }
    } catch (err) {
      errors.push(`Error seeding ${cat}: ${err.message}`);
    }
  }

  const allSuccess = errors.length === 0;

  return res.status(allSuccess ? 200 : 207).json({
    success: allSuccess,
    store: 'bbc-baznas-db',
    seeded_count: Object.keys(results).length,
    results,
    errors
  });
}
