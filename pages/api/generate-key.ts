import type { NextApiRequest, NextApiResponse } from 'next';
import { searchClient } from '../../utils/searchClient';

type ResponseData = {
  key: string;
} | {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the parent API key (should be different from your search-only API key)
    const parentKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!parentKey) {
      throw new Error('Admin API key is not configured');
    }

    // Generate a secured API key with restrictions
    const securedKey = searchClient.generateSecuredApiKey(
      parentKey,
      {
        filters: req.body.filters, // Apply filters from request
        validUntil: Math.floor(Date.now() / 1000) + 3600, // Valid for 1 hour
        restrictIndices: [req.body.indexName], // Restrict to specific index
      }
    );

    res.status(200).json({ key: securedKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate secured API key' });
  }
}