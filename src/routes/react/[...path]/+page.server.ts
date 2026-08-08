import { redirect } from '@sveltejs/kit';
import { docsPaths } from '../../docs-data.server.js';

export const entries = () => docsPaths.map((path) => ({ path }));

export function load({ params }) {
  const suffix = params.path ? `/${params.path}` : '';
  redirect(308, `/svelte${suffix}`);
}
