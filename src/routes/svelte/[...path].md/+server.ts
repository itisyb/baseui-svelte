import { error } from '@sveltejs/kit';
import { docsPaths, getDocsPage } from '../../docs-data.server.js';

export const prerender = true;

export const entries = () => docsPaths.filter(Boolean).map((path) => ({ path }));

export async function GET({ fetch, params }) {
  const page = await getDocsPage(fetch, params.path ?? '');
  if (!page) error(404, 'Documentation page not found');
  return new Response(page.markdown, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
