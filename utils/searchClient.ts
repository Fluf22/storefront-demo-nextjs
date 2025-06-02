import algoliasearch from 'algoliasearch';

import { APP_ID, SEARCH_API_KEY } from '../constants';

export const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY);

// Create a separate admin client for server-side operations
export const adminClient = algoliasearch(
  APP_ID,
  process.env.ALGOLIA_ADMIN_KEY || SEARCH_API_KEY
);