import { marked } from 'marked';

export const UPSTREAM_COMMIT = '7ffe6342b09eea1721892e1e274419de17f02873';
const DOCS_SOURCE_ROOT = `https://raw.githubusercontent.com/mui/base-ui/${UPSTREAM_COMMIT}/docs/src/app/(docs)/react`;

export const components = [
  'Accordion',
  'Alert Dialog',
  'Autocomplete',
  'Avatar',
  'Button',
  'Checkbox',
  'Checkbox Group',
  'Collapsible',
  'Combobox',
  'Context Menu',
  'Dialog',
  'Drawer',
  'Field',
  'Fieldset',
  'Form',
  'Input',
  'Menu',
  'Menubar',
  'Meter',
  'Navigation Menu',
  'Number Field',
  'OTP Field',
  'Popover',
  'Preview Card',
  'Progress',
  'Radio',
  'Scroll Area',
  'Select',
  'Separator',
  'Slider',
  'Switch',
  'Tabs',
  'Toast',
  'Toggle',
  'Toggle Group',
  'Toolbar',
  'Tooltip',
] as const;

export const overview = ['Quick start', 'Accessibility', 'Releases', 'Community', 'About'] as const;
export const handbook = ['Styling', 'Animation', 'Composition', 'Customization', 'Forms', 'TypeScript', 'llms.txt'] as const;
export const utils = ['CSP Provider', 'Direction Provider', 'mergeProps', 'useRender'] as const;

const releaseVersions = [
  'v1-0-0-alpha-4', 'v1-0-0-alpha-5', 'v1-0-0-alpha-6', 'v1-0-0-alpha-7',
  'v1-0-0-alpha-8', 'v1-0-0-beta-0', 'v1-0-0-beta-1', 'v1-0-0-beta-2',
  'v1-0-0-beta-3', 'v1-0-0-beta-4', 'v1-0-0-beta-5', 'v1-0-0-beta-6',
  'v1-0-0-beta-7', 'v1-0-0-rc-0', 'v1-0-0-rc-1', 'v1-0-0-rc-2', 'v1-0-0',
  'v1-1-0', 'v1-2-0', 'v1-3-0', 'v1-4-0', 'v1-4-1', 'v1-5-0', 'v1-6-0', 'v1-7-0',
] as const;

export const docsPaths = [
  '',
  'overview',
  ...overview.filter((item) => item !== 'About').map((item) => `overview/${slug(item)}`),
  'overview/about',
  ...releaseVersions.map((version) => `overview/releases/${version}`),
  'handbook',
  ...handbook.filter((item) => item !== 'llms.txt').map((item) => `handbook/${slug(item)}`),
  'components',
  ...components.map((component) => `components/${slug(component)}`),
  'utils',
  ...utils.map((item) => `utils/${slug(item)}`),
] as const;

export interface DocsHeading {
  depth: number;
  id: string;
  text: string;
}

export interface DocsPageData {
  components: readonly string[];
  html: string;
  markdown: string;
  path: string;
  title: string;
  headings: DocsHeading[];
}

export function slug(value: string) {
  if (value === 'mergeProps') return 'merge-props';
  if (value === 'useRender') return 'use-render';
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s\u00a0]+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

function headingSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s\u00a0]+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

export function localDocsHref(section: string, item: string) {
  if (item === 'llms.txt') return '/llms.txt';
  return `/svelte/${section.toLowerCase()}/${slug(item)}`;
}

function resolveMarkdownTarget(pagePath: string, target: string) {
  if (target === '/react/components/checkbox#CheckboxRoot-indeterminate') return '/svelte/components/checkbox#root';
  if (target.endsWith('#ToastuseToastManager-promise')) return target.replace(/\/react\//, '/svelte/').replace('#ToastuseToastManager-promise', '#promise-method');
  if (target.startsWith('/react/')) return `/svelte/${target.slice('/react/'.length)}`;
  if (target === '/react') return '/svelte';
  if (target === '/llms.txt') return target;
  if (!target.endsWith('/page.mdx') && !target.endsWith('page.mdx')) return target;

  const base = new URL(`/svelte/${pagePath ? `${pagePath}/` : ''}`, 'https://docs.local');
  const resolved = new URL(target, base).pathname.replace(/\/page\.mdx$/, '').replace(/\/$/, '');
  return resolved || '/svelte';
}

function rewriteLinks(markdown: string, pagePath: string) {
  return markdown.replace(/\]\(([^)]+)\)/g, (match, target: string) => {
    const [url, title] = target.split(/\s+(?=["'])/, 2);
    const resolved = resolveMarkdownTarget(pagePath, url);
    return `](${resolved}${title ? ` ${title}` : ''})`;
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function unescapeHtml(value: string) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}

function demoTag(name: string) {
  const part = name.replace(/^Demo[A-Za-z0-9]+/, '') || 'Root';
  if (/Trigger|Button|Close|Increment|Decrement|Clear|Remove|Arrow/.test(part)) return 'button';
  if (/Input/.test(part)) return 'input';
  if (/Label/.test(part)) return 'label';
  if (/Header/.test(part)) return 'h3';
  if (/Link/.test(part)) return 'a';
  if (/List/.test(part)) return 'ul';
  return 'div';
}

function jsxPreview(source: string) {
  const returned = source.match(/return\s*\(\s*([\s\S]*?)\s*\);/m)?.[1] ?? '';
  if (!returned) return '';

  let html = returned
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/className=\{styles\.([A-Za-z0-9_]+)\}/g, 'class="$1"')
    .replace(/className="([^"]*)"/g, 'class="$1"')
    .replace(/style=\{\{[\s\S]*?\}\}/g, '')
    .replace(/\{\.\.\.[^}]+\}/g, '')
    .replace(/\{(['"`])([\s\S]*?)\1\}/g, '$2')
    .replace(/\{[^{}]*\}/g, '')
    .replace(/<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)([^>]*)\/>/g, (_match, name: string, attributes: string) => {
      if (/Icon$/.test(name)) {
        return '<svg class="DemoIcon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M1.5 8h13M8 14.5v-13" /></svg>';
      }
      const tag = demoTag(name);
      return `<${tag}${attributes} data-demo-part="${name.split('.').at(-1)}"></${tag}>`;
    })
    .replace(/<\/?([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)([^>]*)>/g, (match, name: string, attributes: string) => {
      const closing = match.startsWith('</');
      const tag = demoTag(name);
      if (closing) return `</${tag}>`;
      const part = name.split('.').at(-1);
      const hidden = /^(Panel|Popup|Positioner|Backdrop|Portal|Viewport|Content)$/.test(part ?? '') ? ' hidden' : '';
      return `<${tag}${attributes} data-demo-part="${part}"${hidden}>`;
    })
    .replace(/\s(?:on[A-Z][A-Za-z]+|value|defaultValue|open|defaultOpen|checked|defaultChecked|items|itemToString|onOpenChange|onValueChange)=\{[^}]*\}/g, '')
    .replace(/\s(?:key|ref)=\{[^}]*\}/g, '')
    .replace(/<>|<\/\>/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  // React expressions that remain after the conservative pass are not valid HTML.
  html = html.replace(/\{[\s\S]*?\}/g, '');
  return html;
}

function translateDemoSource(source: string) {
  const body = source.match(/return\s*\(\s*([\s\S]*?)\s*\);/m)?.[1]?.trim() ?? source;
  return source
    .slice(0, source.indexOf('export default function'))
    .replace(/^import \* as React from 'react';\s*$/m, '')
    .replace(/^import styles from '[^']+';\s*$/m, '')
    .replace(/import \{ ([A-Za-z0-9]+) \} from '@base-ui\/react\/([^']+)'/g, "import * as $1 from '@itisyb/baseui-svelte/$2'")
    .trim()
    .concat('\n\n', body)
    .replaceAll('className=', 'class=')
    .replace(/\{styles\.([A-Za-z0-9_]+)\}/g, '"$1"')
    .replaceAll('React components', 'Svelte components')
    .replaceAll('"/react/', '"/svelte/')
    .replaceAll("'/react/", "'/svelte/")
    .replace(/\/>/g, ' />');
}

async function fetchText(fetcher: typeof fetch, url: string) {
  const response = await fetcher(url);
  return response.ok ? response.text() : '';
}

async function renderDemo(fetcher: typeof fetch, pagePath: string, importPath: string, name: string) {
  const demoPath = importPath.replace(/^\.\//, '');
  const baseUrl = `${DOCS_SOURCE_ROOT}/${pagePath}/${demoPath}`;
  let sourceUrl = `${baseUrl}/css-modules/index.tsx`;
  let source = await fetchText(fetcher, sourceUrl);
  let variant = 'CSS Modules';
  if (!source) {
    sourceUrl = `${baseUrl}/tailwind/index.tsx`;
    source = await fetchText(fetcher, sourceUrl);
    variant = 'Tailwind';
  }
  if (!source) return '';

  const cssImport = source.match(/import styles from '([^']+)'/)?.[1];
  let css = '';
  if (cssImport) {
    const cssUrl = new URL(cssImport, sourceUrl).href;
    css = await fetchText(fetcher, cssUrl);
  }
  css = css.replace(/(^|\n)(\s*)(\.[A-Za-z_][A-Za-z0-9_-]*)/g, `$1$2[data-demo="${name}"] $3`);

  const preview = jsxPreview(
    source
      .replaceAll('React components', 'Svelte components')
      .replaceAll('"/react/', '"/svelte/')
      .replaceAll("'/react/", "'/svelte/"),
  );
  const translated = translateDemoSource(source);
  const html = `<div class="DemoRoot" data-demo="${name}">
<style>${css}</style>
<div class="DemoPreview">${preview}</div>
<div class="DemoToolbar"><span>index.svelte</span>${css ? '<span>index.css</span>' : ''}<span class="DemoToolbarSpacer"></span><span>${variant}</span><span>StackBlitz ↗</span><span aria-hidden="true">⋮</span></div>
<pre class="DemoCode"><code class="language-svelte">${escapeHtml(translated)}</code></pre>
<button class="DemoShowCode" type="button">Show code</button>
</div>`;
  return `\n<!--DEMO:${encodeURIComponent(html)}-->\n`;
}

function protectCodeFences(markdown: string) {
  return markdown.replace(/```([A-Za-z0-9_-]+)?(?:\s+title="([^"]+)")?\s*\n([\s\S]*?)```/g, (_match, language = '', title = '', code: string) => {
    const html = `<figure class="CodeFrame${title ? '' : ' CodeFrameUntitled'}">${title ? `<figcaption>${escapeHtml(title)}<button type="button" aria-label="Copy code">□</button></figcaption>` : ''}<pre><code class="language-${escapeHtml(language)}">${escapeHtml(code.replace(/\n$/, ''))}</code></pre></figure>`;
    return `\n<!--RAW:${encodeURIComponent(html)}-->\n`;
  });
}

function markdownForHumans(markdown: string) {
  return markdown
    .replace(/<!--DEMO:([\s\S]*?)-->/g, (_match, encoded: string) => {
      const html = decodeURIComponent(encoded);
      const code = unescapeHtml(html.match(/<pre class="DemoCode"><code[^>]*>([\s\S]*?)<\/code><\/pre>/)?.[1] ?? '');
      const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
      return `${code ? `\n\`\`\`svelte\n${code}\n\`\`\`\n` : ''}${css ? `\n\`\`\`css\n${css}\n\`\`\`\n` : ''}`;
    })
    .replace(/<div class="Subtitle"><p>([\s\S]*?)<\/p><\/div>/g, '$1')
    .replace(/^\s*\n{3,}/gm, '\n\n')
    .trim()
    .concat('\n');
}

async function expandMdx(fetcher: typeof fetch, pagePath: string, markdown: string) {
  const imports = new Map<string, string>();
  for (const match of markdown.matchAll(/^import \{ (Demo[A-Za-z0-9]+) \} from '([^']+)';$/gm)) {
    imports.set(match[1], match[2]);
  }

  let types = '';
  if (/<Types[A-Za-z0-9.]+\s*\/>/.test(markdown)) {
    types = await fetchText(fetcher, `${DOCS_SOURCE_ROOT}/${pagePath}/types.md`);
  }

  const demoNames = [...markdown.matchAll(/<((?:Demo)[A-Za-z0-9]+)\s*\/>/g)].map((match) => match[1]);
  const demos = new Map<string, string>();
  await Promise.all([...new Set(demoNames)].map(async (name) => {
    const importPath = imports.get(name);
    if (importPath) demos.set(name, await renderDemo(fetcher, pagePath, importPath, name));
  }));

  return markdown
    .replace(/^<((?:Demo)[A-Za-z0-9]+)\s*\/>\s*$/gm, (_match, name: string) => demos.get(name) ?? '')
    .replace(/^<Types[A-Za-z0-9]+Additional\s+showAdditionalTypes=\{\[([^\]]+)\]\}\s*\/>\s*$/gm, (_match, names: string) => {
      const sections = [...names.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
      return sections.map((name) => {
        const heading = [...types.matchAll(/^### ([^\n]+)\s*\n/gm)].find((match) => slug(match[1]) === slug(name))?.[1];
        if (!heading) return '';
        const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const section = types.match(new RegExp(`^### ${escaped}\\s*\\n([\\s\\S]*?)(?=^### |\\Z)`, 'm'))?.[1] ?? '';
        return `\n### ${heading}\n\n${section.trim()}\n`;
      }).join('\n');
    })
    .replace(/^<Types[A-Za-z0-9]+\.([A-Za-z0-9.]+)(?:\s+[^>]*)?\s*\/>\s*$/gm, (_match, part: string) => {
      if (!types) return '';
      const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const section = types.match(new RegExp(`^### ${escaped}\\s*\\n([\\s\\S]*?)(?=^### |\\Z)`, 'm'))?.[1] ?? '';
      return `\n${section.trim()}\n`;
    })
    .replace(/^<Types[A-Za-z0-9]+(?:\s+[^>]*)?\s*\/>\s*$/gm, () => {
      const reference = types.match(/^## API Reference\s*\n([\s\S]*?)(?=^## |\Z)/m)?.[1] ?? '';
      return `\n${reference.trim()}\n`;
    });
}

function stripMdx(markdown: string) {
  return markdown
    .replace(/\nexport const metadata = \{[\s\S]*$/m, '')
    .replace(/^import .* from '\.\/.*';\s*$/gm, '')
    .replace(/<Meta\b[\s\S]*?\/>/g, '')
    .replace(/<Subtitle>([\s\S]*?)<\/Subtitle>/g, '<div class="Subtitle"><p>$1</p></div>')
    .replace(/<Aside[^>]*>/g, '<aside>')
    .replace(/<\/Aside>/g, '</aside>');
}

function translateSvelte(markdown: string, pagePath: string) {
  if (pagePath.startsWith('overview/releases/')) return markdown;
  return markdown
    .replaceAll('@base-ui/react', '@itisyb/baseui-svelte')
    .replaceAll('unstyled React ', 'unstyled Svelte ')
    .replaceAll('React component', 'Svelte component')
    .replaceAll('React components', 'Svelte components')
    .replaceAll('React UI', 'Svelte UI')
    .replaceAll('React application', 'Svelte application')
    .replaceAll('https://base-ui.com/react/', '/svelte/')
    .replace(/```(?:jsx|tsx)/g, '```svelte')
    .replace(/import \{ ([A-Za-z0-9]+) \} from '@itisyb\/baseui-svelte\/([^']+)';/g, "import * as $1 from '@itisyb/baseui-svelte/$2';")
    .replaceAll('className', 'class')
    .replaceAll('React.CSSProperties', 'string')
    .replace(/React\.Ref<([^>]+)>/g, '$1 | null')
    .replaceAll('ReactElement', 'Snippet')
    .replaceAll('render prop', 'child snippet')
    .replaceAll('`render` prop', '`child` snippet');
}

function addHeadingIds(html: string) {
  return html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_match, level: string, text: string) => {
    const plain = text.replaceAll('&nbsp;', ' ').replace(/<[^>]+>/g, '');
    return `<h${level} id="${headingSlug(plain)}">${text}</h${level}>`;
  });
}

function getHeadings(html: string) {
  const headings: DocsHeading[] = [];
  for (const match of html.matchAll(/<h([2-3]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)) {
    headings.push({
      depth: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').replaceAll('&nbsp;', '\u00a0'),
    });
  }
  return headings;
}

function addContentActions(html: string, pagePath: string) {
  if (!pagePath || ['overview', 'handbook', 'components', 'utils'].includes(pagePath)) return html;
  const sourcePath = pagePath.startsWith('components/')
    ? `src/lib/${pagePath.slice('components/'.length)}`
    : 'src/routes/docs-data.server.ts';
  const actions = `<div class="ContentActions"><a aria-label="View markdown source" rel="alternate" type="text/markdown" href="/svelte/${pagePath}.md"><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14.846 12.9233H1.154a1.153 1.153 0 0 1-.44136-.0878 1.152 1.152 0 0 1-.37416-.25 1.153 1.153 0 0 1-.25002-.3741 1.154 1.154 0 0 1-.08779-.4414V4.22999A1.15335 1.15335 0 0 1 1.154 3.07666h13.692c.1515 0 .3014.02983.4414.08779a1.1535 1.1535 0 0 1 .7119 1.06554v7.53871c.0001.1515-.0296.3015-.0876.4415-.0579.14-.1428.2673-.2499.3744a1.153 1.153 0 0 1-.3743.2502c-.14.058-.29.0885-.4415.0885m-11-2.308V7.61533l1.53867 1.92333 1.538-1.92333v2.99997h1.53867V5.38533H6.92267l-1.538 1.92333L3.846 5.38533H2.30734v5.23137zm10.308-2.61531h-1.5387V5.38466h-1.538v2.61533H9.53867L11.846 10.6927z" fill="currentColor"></path></svg>View as Markdown</span></a><a aria-label="View source on GitHub" target="_blank" rel="noopener noreferrer" href="https://github.com/itisyb/baseui-svelte/tree/main/${sourcePath}"><span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.78.4.07.55-.17.55-.39 0-.19-.01-.84-.01-1.53-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.97-.82-1.16-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.84.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.2-3.64-.91-3.64-4.05 0-.89.31-1.63.82-2.2-.08-.21-.36-1.05.08-2.17 0 0 .67-.22 2.2.84A7.6 7.6 0 0 1 8 3.98c.68 0 1.36.09 2 .28 1.53-1.07 2.2-.84 2.2-.84.44 1.13.16 1.97.08 2.17.51.57.82 1.3.82 2.2 0 3.15-1.87 3.84-3.65 4.05.29.26.54.75.54 1.52 0 1.1-.01 1.98-.01 2.26 0 .22.15.47.55.39C13.71 14.9 16 11.82 16 8.2 16 3.67 12.42 0 8 0" /></svg>View source</span></a></div>`;
  if (html.includes('<div class="Subtitle">')) {
    return html.replace(/(<div class="Subtitle">[\s\S]*?<\/p>)(<\/div>)/, `$1${actions}$2`);
  }
  return html.replace('</h1>', `</h1>${actions}`);
}

function rewriteRenderedLinks(html: string) {
  return html
    .replace(/href="https:\/\/base-ui\.com\/react\/([^"]*)"/g, 'href="/svelte/$1"')
    .replace(/href="\/react\/([^"]*)"/g, 'href="/svelte/$1"');
}

async function renderMarkdown(markdown: string) {
  markdown = protectCodeFences(markdown);
  const chunks = markdown.split(/<details>|<\/details>/);
  const rendered: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    let chunk = chunks[index];
    const insideDetails = index % 2 === 1;
    if (insideDetails) {
      chunk = chunk.replace(/^\s*<summary>Outline<\/summary>\s*/, '');
      rendered.push(`<details><summary>Outline</summary>${await marked.parse(chunk)}</details>`);
    } else {
      rendered.push(await marked.parse(chunk));
    }
  }
  const html = rendered.join('')
    .replace(/<!--DEMO:([\s\S]*?)-->/g, (_match, encoded: string) => decodeURIComponent(encoded))
    .replace(/<!--RAW:([\s\S]*?)-->/g, (_match, encoded: string) => decodeURIComponent(encoded));
  return addHeadingIds(html);
}

const cache = new Map<string, Promise<DocsPageData>>();

export function getDocsPage(fetcher: typeof fetch, pagePath: string) {
  const normalized = pagePath.replace(/^\/+|\/+$/g, '');
  if (!docsPaths.includes(normalized as (typeof docsPaths)[number])) {
    return Promise.resolve(null);
  }
  let pending = cache.get(normalized);
  if (!pending) {
    pending = (async () => {
      const sourceUrl = `${DOCS_SOURCE_ROOT}/${normalized ? `${normalized}/` : ''}page.mdx`;
      const response = await fetcher(sourceUrl);
      if (!response.ok) throw new Error(`Unable to load pinned Base UI docs source (${response.status}): ${normalized}`);
      let source = await response.text();

      if (normalized === 'components') {
        const metadataMarker = "[//]: # 'The above section is autogenerated";
        source = source.slice(0, source.indexOf(metadataMarker));
        source = source.replace(/ - \(\[Outline\]/g, '\u00a0— ([Outline]');
      }

      source = await expandMdx(fetcher, normalized, source);
      const markdown = translateSvelte(stripMdx(rewriteLinks(source, normalized)), normalized);
      let html = await renderMarkdown(markdown);
      html = rewriteRenderedLinks(html);
      html = addContentActions(html, normalized);
      const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '') ?? 'Base UI';
      const headings = normalized === 'components'
        ? components.map((component) => ({ depth: 2, id: slug(component), text: component }))
        : getHeadings(html);
      return { components, html, markdown: markdownForHumans(markdown), path: normalized, title, headings };
    })();
    cache.set(normalized, pending);
  }
  return pending;
}

export function componentSlug(component: string) {
  return slug(component);
}
