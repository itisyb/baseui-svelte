import { error } from '@sveltejs/kit';
import { docsPaths, getDocsPage } from '../../docs-data.server.js';

export const entries = () => docsPaths.map((path) => ({ path }));

export async function load({ fetch, params }) {
  const page = await getDocsPage(fetch, params.path ?? '');
  if (!page) error(404, 'Not found');
  return page;
}
