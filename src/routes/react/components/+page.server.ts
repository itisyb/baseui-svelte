import { components, getComponentsHtml } from '../../docs-data.server';

export async function load({ fetch }) {
  return {
    components,
    html: await getComponentsHtml(fetch),
  };
}
