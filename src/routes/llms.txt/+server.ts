export const prerender = true;

export async function GET({ fetch }) {
  const response = await fetch('https://base-ui.com/llms.txt');
  if (!response.ok) return new Response(null, { status: response.status });
  const text = (await response.text())
    .replaceAll('https://base-ui.com/react/', 'https://baseui-svelte.vercel.app/svelte/')
    .replaceAll('@base-ui/react', '@itisyb/baseui-svelte');
  return new Response(text, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
