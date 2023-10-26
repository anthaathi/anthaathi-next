import { Client } from '@opensearch-project/opensearch';

export const openSearchClient = new Client({
  auth: {
    password: process.env.OPENSEARCH_PASSWORD ?? 'admin',
    username: process.env.OPENSEARCH_USERNAME ?? 'admin',
  },
  ssl: {
    rejectUnauthorized: process.env.OPENSEARCH_REJECT_UNAUTHORIZED === 'true' ?? process.env.NODE_ENV === 'development',
  },
  nodes: (process.env.OPENSEARCH_ENDPOINT ?? 'https://localhost:9200').split(','),
});
