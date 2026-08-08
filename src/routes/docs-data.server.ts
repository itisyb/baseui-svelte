import { marked } from 'marked';
import { codeToHtml, type BundledLanguage } from 'shiki';
import { compile as compileSvelte } from 'svelte/compiler';
import ts from 'typescript';

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

async function highlightCode(code: string, language: string) {
  const aliases: Record<string, BundledLanguage> = {
    bash: 'bash',
    css: 'css',
    html: 'html',
    js: 'javascript',
    javascript: 'javascript',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    sh: 'bash',
    svelte: 'svelte',
    ts: 'typescript',
    tsx: 'tsx',
    typescript: 'typescript',
  };
  const lang = aliases[language.toLowerCase()] ?? 'text';
  const html = await codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
  return (html.match(/<code>([\s\S]*?)<\/code>/)?.[1] ?? escapeHtml(code))
    // Shiki separates block-level line spans with text newlines. Keeping both
    // creates an extra anonymous line box inside a <pre> in Chromium.
    .replace(/<\/span>\n<span class="line"/g, '</span><span class="line"');
}

function installationBlock(packageName: string) {
  const managers = [
    { value: 'pnpm', command: 'add' },
    { value: 'npm', command: 'i' },
    { value: 'yarn', command: 'add' },
    { value: 'bun', command: 'add' },
  ] as const;
  const selected = 'npm';
  const tabs = managers.map(({ value }) =>
    `<button class="InstallationBlockTab" type="button" role="tab" id="installation-tab-${value}" aria-controls="installation-panel-${value}" aria-selected="${value === selected}" tabindex="${value === selected ? '0' : '-1'}" data-value="${value}"${value === selected ? ' data-active=""' : ''}><span>${value}</span></button>`,
  ).join('');
  const panels = managers.map(({ value, command }) =>
    `<div class="InstallationBlockTabPanel" role="tabpanel" id="installation-panel-${value}" aria-labelledby="installation-tab-${value}" data-value="${value}"${value === selected ? '' : ' hidden'}><div class="CodeBlockViewport"><pre class="CodeBlockPreInline CodeBlockPre"><code class="language-bash"><span class="frame"><span class="line"><span class="pl-en">${value}</span> <span class="pl-smi">${command}</span> <span class="pl-s">${escapeHtml(packageName)}</span></span></span></code></pre></div></div>`,
  ).join('');
  return `<div class="InstallationBlock" data-installation-block=""><div class="CodeBlockRoot" role="figure" aria-labelledby="installation-title"><div class="CodeBlockPanel"><span id="installation-title" class="VisuallyHidden">Installation command</span><div class="InstallationBlockTabsList" role="tablist" aria-label="Package manager">${tabs}</div><button class="CodeBlockCopyButton" type="button" aria-label="Copy code"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor"/><path d="M10.5 5.5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" stroke="currentColor"/></svg></button></div>${panels}</div></div>`;
}

function demoTag(name: string, attributes = '') {
  const part = name.split('.').at(-1) ?? name;
  if (name === 'ContextMenu.Trigger') return 'div';
  if (name === 'Avatar.Root' || name === 'Avatar.Fallback') return 'span';
  if (name === 'Avatar.Image') return 'img';
  if (part === 'Trigger' && /\bhref=/.test(attributes)) return 'a';
  if (/^(Checkbox\.Root|Switch\.Root|Radio\.Root|Toggle|Tabs\.Tab)$/.test(name)) return 'button';
  if (/Trigger|Button|Close|Increment|Decrement|Clear|Remove/.test(part)) return 'button';
  if (part === 'Input' || name === 'Field.Control') return 'input';
  if (part === 'Label') return 'label';
  if (/Header/.test(part)) return 'h3';
  if (/Link/.test(part)) return 'a';
  return 'div';
}

function demoElementAttributes(name: string, attributes: string) {
  const part = name.split('.').at(-1) ?? name;
  let result = attributes;
  if (demoTag(name, attributes) === 'button' && !/\btype=/.test(result)) result += ' type="button"';
  if (part === 'Trigger' && !/\baria-expanded=/.test(result)) result += ' aria-expanded="false"';
  if (part === 'Increment' && !/\baria-label=/.test(result)) result += ' aria-label="Increase"';
  if (part === 'Decrement' && !/\baria-label=/.test(result)) result += ' aria-label="Decrease"';
  if (part === 'ChipRemove' && !/\baria-label=/.test(result)) result += ' aria-label="Remove item"';
  const initiallyChecked = /\b(?:checked|defaultChecked)(?:\s|=|$)/.test(result);
  const initiallyPressed = /\b(?:pressed|defaultPressed)(?:\s|=|$)/.test(result);
  if (name === 'Checkbox.Root' && !/\brole=/.test(result)) result += ` role="checkbox" aria-checked="${initiallyChecked}"${initiallyChecked ? ' data-checked=""' : ' data-unchecked=""'}`;
  if (name === 'Switch.Root' && !/\brole=/.test(result)) result += ` role="switch" aria-checked="${initiallyChecked}"${initiallyChecked ? ' data-checked=""' : ' data-unchecked=""'}`;
  if (name === 'Radio.Root' && !/\brole=/.test(result)) result += ` role="radio" aria-checked="${initiallyChecked}"${initiallyChecked ? ' data-checked=""' : ' data-unchecked=""'}`;
  if (name === 'Toggle' && !/\baria-pressed=/.test(result)) result += ` aria-pressed="${initiallyPressed}"${initiallyPressed ? ' data-pressed=""' : ''}`;
  if (name === 'Tabs.Tab' && !/\brole=/.test(result)) result += ' role="tab" aria-selected="false"';
  if (name === 'Avatar.Image' && !/\balt=/.test(result)) result += ' alt=""';
  return result;
}

function jsxPreview(source: string, cssModulePrefix = '', sourceMode = false) {
  const sourceFile = ts.createSourceFile('demo.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  type DemoLiteral = string | number | boolean | Record<string, string | number | boolean>;
  let returned: ts.Expression | undefined;
  const localComponents = new Map<string, ts.Expression>();
  const constants = new Map<string, string | number>();
  const collectionSizes = new Map<string, number>();
  const collectionValues = new Map<string, DemoLiteral[]>();
  const bindings = new Map<string, DemoLiteral>();
  const collectionStack: DemoLiteral[][] = [];

  function literalValue(expression: ts.Expression): DemoLiteral | null {
    if (ts.isStringLiteralLike(expression)) return expression.text;
    if (ts.isNumericLiteral(expression)) return Number(expression.text);
    if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isObjectLiteralExpression(expression)) {
      const result: Record<string, string | number | boolean> = {};
      for (const property of expression.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const value = literalValue(property.initializer);
        if (value === null || typeof value === 'object') continue;
        result[property.name.getText(sourceFile).replace(/^['"]|['"]$/g, '')] = value;
      }
      return result;
    }
    return null;
  }

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
        if (ts.isStringLiteralLike(declaration.initializer)) constants.set(declaration.name.text, declaration.initializer.text);
        if (ts.isNumericLiteral(declaration.initializer)) constants.set(declaration.name.text, Number(declaration.initializer.text));
        if (ts.isArrayLiteralExpression(declaration.initializer)) {
          collectionSizes.set(declaration.name.text, declaration.initializer.elements.length);
          const values = declaration.initializer.elements
            .map((element) => ts.isExpression(element) ? literalValue(element) : null)
            .filter((value): value is DemoLiteral => value !== null);
          if (values.length === declaration.initializer.elements.length) collectionValues.set(declaration.name.text, values);
        }
      }
    }
    if (!ts.isFunctionDeclaration(statement) || !statement.body) continue;
    const returnExpression = statement.body.statements.find(ts.isReturnStatement)?.expression;
    if (!returnExpression) continue;
    if (statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
      returned = returnExpression;
    } else if (statement.name) {
      localComponents.set(statement.name.text, returnExpression);
    }
  }
  if (!returned) return '';

  function expressionValue(expression: ts.Expression | undefined): string | null {
    if (!expression) return '';
    if (ts.isStringLiteralLike(expression) || ts.isNumericLiteral(expression)) return expression.text;
    if (ts.isIdentifier(expression) && bindings.has(expression.text)) {
      const value = bindings.get(expression.text);
      return typeof value === 'object' ? null : String(value);
    }
    if (ts.isIdentifier(expression) && constants.has(expression.text)) return String(constants.get(expression.text));
    if (expression.kind === ts.SyntaxKind.TrueKeyword) return '';
    if (expression.kind === ts.SyntaxKind.FalseKeyword || expression.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isPropertyAccessExpression(expression) && expression.expression.getText(sourceFile) === 'styles') {
      return `${cssModulePrefix}${expression.name.text}`;
    }
    if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression)) {
      const owner = bindings.get(expression.expression.text);
      if (owner && typeof owner === 'object') {
        const value = owner[expression.name.text];
        if (value !== undefined) return String(value);
      }
    }
    if (ts.isTemplateExpression(expression)) {
      let result = expression.head.text;
      for (const span of expression.templateSpans) {
        const value = expressionValue(span.expression);
        if (value === null) return null;
        result += value + span.literal.text;
      }
      return result;
    }
    return null;
  }

  function renderAttributes(
    attributes: ts.JsxAttributes,
    componentName: string | null,
  ) {
    const result: string[] = [];
    for (const property of attributes.properties) {
      if (!ts.isJsxAttribute(property)) continue;
      let attributeName = property.name.getText(sourceFile);
      if (attributeName === 'className') attributeName = 'class';
      if (attributeName === 'htmlFor') attributeName = 'for';
      if (attributeName === 'tabIndex') attributeName = 'tabindex';
      if (attributeName === 'strokeLinecap') attributeName = 'stroke-linecap';
      if (attributeName === 'strokeLinejoin') attributeName = 'stroke-linejoin';
      if (/^(on[A-Z]|ref$|key$|render$)/.test(attributeName)) continue;
      if (
        attributeName === 'style'
        && property.initializer
        && ts.isJsxExpression(property.initializer)
        && property.initializer.expression
        && ts.isObjectLiteralExpression(property.initializer.expression)
      ) {
        const declarations = property.initializer.expression.properties
          .filter(ts.isPropertyAssignment)
          .map((declaration) => {
            const cssProperty = declaration.name.getText(sourceFile)
              .replace(/^['"]|['"]$/g, '')
              .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            const cssValue = expressionValue(declaration.initializer);
            return cssValue === null ? '' : `${cssProperty}: ${cssValue}`;
          })
          .filter(Boolean)
          .join('; ');
        if (declarations) result.push(`style="${escapeHtml(declarations)}"`);
        continue;
      }
      let value: string | null;
      if (!property.initializer) value = '';
      else if (ts.isStringLiteral(property.initializer)) value = property.initializer.text;
      else if (ts.isJsxExpression(property.initializer)) value = expressionValue(property.initializer.expression);
      else continue;
      if (value === null) continue;
      result.push(value === '' ? attributeName : `${attributeName}="${escapeHtml(value)}"`);
    }
    const joined = result.length ? ` ${result.join(' ')}` : '';
    return componentName && !sourceMode ? demoElementAttributes(componentName, joined) : joined;
  }

  function renderExpression(expression: ts.Expression | undefined): string {
    if (!expression) return '';
    const value = expressionValue(expression);
    if (value !== null) return escapeHtml(value);
    if (ts.isParenthesizedExpression(expression)) return renderExpression(expression.expression);
    if (ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression) || ts.isJsxFragment(expression)) {
      return renderNode(expression);
    }
    if (ts.isConditionalExpression(expression)) {
      return renderExpression(expression.whenTrue) || renderExpression(expression.whenFalse);
    }
    if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) {
      const values = collectionStack.at(-1) ?? [''];
      const callbackBody = ts.isBlock(expression.body)
        ? expression.body.statements.find(ts.isReturnStatement)?.expression
        : expression.body;
      return values.map((item, index) => renderCallback(expression, callbackBody, item, index)).join('');
    }
    if (ts.isCallExpression(expression)) {
      let count = 0;
      let callback: ts.Expression | undefined;
      let values: DemoLiteral[] = [];
      if (ts.isPropertyAccessExpression(expression.expression) && expression.expression.name.text === 'map') {
        const collection = expression.expression.expression;
        if (ts.isIdentifier(collection)) {
          count = collectionSizes.get(collection.text) ?? 1;
          values = collectionValues.get(collection.text) ?? [];
        } else if (ts.isArrayLiteralExpression(collection)) {
          count = collection.elements.length;
          values = collection.elements.map((item) => literalValue(item) ?? '');
        }
        callback = expression.arguments[0];
      } else if (
        ts.isPropertyAccessExpression(expression.expression)
        && expression.expression.expression.getText(sourceFile) === 'Array'
        && expression.expression.name.text === 'from'
      ) {
        const descriptor = expression.arguments[0];
        if (descriptor && ts.isObjectLiteralExpression(descriptor)) {
          const length = descriptor.properties.find((property): property is ts.PropertyAssignment =>
            ts.isPropertyAssignment(property) && property.name.getText(sourceFile) === 'length');
          const value = length ? expressionValue(length.initializer) : null;
          count = value === null ? 0 : Number(value);
        }
        callback = expression.arguments[1];
      }
      if (count > 0 && callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
        const callbackBody = ts.isBlock(callback.body)
          ? callback.body.statements.find(ts.isReturnStatement)?.expression
          : callback.body;
        return Array.from({ length: count }, (_, index) =>
          renderCallback(callback, callbackBody, values[index] ?? index, index)).join('');
      }
    }
    return '';
  }

  function bindParameter(name: ts.BindingName, value: DemoLiteral) {
    const names: string[] = [];
    if (ts.isIdentifier(name)) {
      bindings.set(name.text, value);
      names.push(name.text);
    } else if (ts.isObjectBindingPattern(name) && typeof value === 'object') {
      for (const element of name.elements) {
        if (!ts.isIdentifier(element.name)) continue;
        const key = element.propertyName?.getText(sourceFile) ?? element.name.text;
        const item = value[key];
        if (item === undefined) continue;
        bindings.set(element.name.text, item);
        names.push(element.name.text);
      }
    }
    return names;
  }

  function renderCallback(
    callback: ts.ArrowFunction | ts.FunctionExpression,
    body: ts.Expression | undefined,
    item: DemoLiteral,
    index: number,
  ) {
    const names = callback.parameters[0] ? bindParameter(callback.parameters[0].name, item) : [];
    if (callback.parameters[1]) names.push(...bindParameter(callback.parameters[1].name, index));
    const result = renderExpression(body);
    for (const name of names) bindings.delete(name);
    return result;
  }

  function renderChildren(children: ts.NodeArray<ts.JsxChild>) {
    return children.map((child) => {
      if (ts.isJsxText(child)) return escapeHtml(child.getFullText(sourceFile));
      if (ts.isJsxExpression(child)) return renderExpression(child.expression);
      return renderNode(child);
    }).join('');
  }

  function icon(name: string, attributes: ts.JsxAttributes) {
    const className = attributes.properties
      .filter(ts.isJsxAttribute)
      .find((attribute) => attribute.name.getText(sourceFile) === 'className');
    const value = className?.initializer && ts.isJsxExpression(className.initializer)
      ? expressionValue(className.initializer.expression)
      : className?.initializer && ts.isStringLiteral(className.initializer)
        ? className.initializer.text
        : null;
    const helper = localComponents.get(name);
    const rendered = helper ? renderExpression(helper) : '';
    if (rendered.startsWith('<svg')) {
      return rendered.replace('<svg', `<svg class="DemoIcon${value ? ` ${escapeHtml(value)}` : ''}" aria-hidden="true"`);
    }
    return `<svg class="DemoIcon${value ? ` ${escapeHtml(value)}` : ''}" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round"><path d="M1.5 8h13M8 14.5v-13" /></svg>`;
  }

  function renderNode(node: ts.JsxChild | ts.Expression): string {
    if (ts.isJsxFragment(node)) return renderChildren(node.children);
    if (ts.isJsxElement(node)) {
      const sourceName = node.openingElement.tagName.getText(sourceFile);
      if (sourceName === 'React.Fragment') return renderChildren(node.children);
      const local = !sourceName.includes('.') ? localComponents.get(sourceName) : undefined;
      if (local) return renderExpression(local);
      const componentName = /^[A-Z]/.test(sourceName) ? sourceName : null;
      const attributes = renderAttributes(node.openingElement.attributes, componentName);
      const tag = componentName && !sourceMode ? demoTag(sourceName, attributes) : sourceName;
      const part = componentName ? sourceName.split('.').at(-1) : null;
      const hidden = !sourceMode && part && /^(Panel|Popup|Positioner|Backdrop|Portal|Viewport|Content|Error|ScrubAreaCursor)$/.test(part) ? ' hidden' : '';
      const itemsAttribute = node.openingElement.attributes.properties
        .filter(ts.isJsxAttribute)
        .find((attribute) => attribute.name.getText(sourceFile) === 'items');
      const itemsExpression = itemsAttribute?.initializer && ts.isJsxExpression(itemsAttribute.initializer)
        ? itemsAttribute.initializer.expression
        : undefined;
      const collection = itemsExpression && ts.isIdentifier(itemsExpression)
        ? collectionValues.get(itemsExpression.text)
        : undefined;
      if (collection) collectionStack.push(collection);
      const children = renderChildren(node.children);
      if (collection) collectionStack.pop();
      const accessibleName = !sourceMode && tag === 'button' && !/\baria-label=/.test(attributes) && !plainText(children)
        ? ' aria-label="Open menu"'
        : '';
      const renderedChildren = tag === 'a' ? children.trim() : children;
      return `<${tag}${attributes}${accessibleName}${componentName && !sourceMode ? ` data-demo-component="${componentName}"` : ''}${part && !sourceMode ? ` data-demo-part="${part}"` : ''}${hidden}>${renderedChildren}</${tag}>`;
    }
    if (ts.isJsxSelfClosingElement(node)) {
      const sourceName = node.tagName.getText(sourceFile);
      if (sourceName === 'React.Fragment') return '';
      if (/Icon$/.test(sourceName)) return icon(sourceName, node.attributes);
      const local = !sourceName.includes('.') ? localComponents.get(sourceName) : undefined;
      if (local) return renderExpression(local);
      const componentName = /^[A-Z]/.test(sourceName) ? sourceName : null;
      const attributes = renderAttributes(node.attributes, componentName);
      const tag = componentName && !sourceMode ? demoTag(sourceName, attributes) : sourceName;
      const part = componentName ? sourceName.split('.').at(-1) : null;
      if (sourceMode) return `<${tag}${attributes} />`;
      if (/^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/.test(tag)) {
        return `<${tag}${attributes}${componentName ? ` data-demo-component="${componentName}"` : ''}${part ? ` data-demo-part="${part}"` : ''}>`;
      }
      const placeholder = part === 'Value'
        ? node.attributes.properties
            .filter(ts.isJsxAttribute)
            .find((attribute) => attribute.name.getText(sourceFile) === 'placeholder')
        : undefined;
      const placeholderText = placeholder?.initializer && ts.isStringLiteral(placeholder.initializer)
        ? escapeHtml(placeholder.initializer.text)
        : '';
      const hidden = part && /^(Panel|Popup|Positioner|Backdrop|Portal|Viewport|Content|Error|ScrubAreaCursor)$/.test(part) ? ' hidden' : '';
      return `<${tag}${attributes}${componentName ? ` data-demo-component="${componentName}"` : ''}${part ? ` data-demo-part="${part}"` : ''}${hidden}>${placeholderText}</${tag}>`;
    }
    if (ts.isJsxExpression(node)) return renderExpression(node.expression);
    if (ts.isJsxText(node)) return escapeHtml(node.getFullText(sourceFile));
    return '';
  }

  return renderExpression(returned).replace(/\n\s*\n/g, '\n').trim();
}

function dedent(value: string) {
  const lines = value.replace(/\r\n?/g, '\n').split('\n');
  while (lines[0]?.trim() === '') lines.shift();
  while (lines.at(-1)?.trim() === '') lines.pop();

  const nonEmptyLines = lines.filter((line) => line.trim() !== '');
  const indentation = nonEmptyLines.length
    ? Math.min(...nonEmptyLines.map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0))
    : 0;

  return lines
    .map((line) => line.trim() === '' ? '' : line.slice(indentation))
    .join('\n');
}

export function translateDemoSource(source: string) {
  const body = dedent(
    source.match(/return[ \t]*\([ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*\);/m)?.[1]
      ?? source.match(/return\s*\(\s*([\s\S]*?)\s*\);/m)?.[1]
      ?? source.match(/return\s+([^;]+);/m)?.[1]
      ?? '',
  );
  const namespaceComponents = new Set([
    'Accordion', 'AlertDialog', 'Autocomplete', 'Checkbox', 'CheckboxGroup', 'Collapsible',
    'Combobox', 'ContextMenu', 'Dialog', 'Drawer', 'Field', 'Fieldset', 'Form', 'Menu',
    'Menubar', 'NavigationMenu', 'NumberField', 'OTPField', 'Popover', 'PreviewCard',
    'RadioGroup', 'ScrollArea', 'Select', 'Slider', 'Tabs', 'Toast', 'ToggleGroup',
    'Toolbar', 'Tooltip',
  ]);
  const imports = [...source.matchAll(/import\s+\{\s*([A-Za-z0-9]+)\s*\}\s+from\s+'@base-ui\/react\/([^']+)'/g)]
    .map((match) => namespaceComponents.has(match[1])
      ? `import * as ${match[1]} from '@itisyb/baseui-svelte/${match[2]}';`
      : `import { ${match[1]} } from '@itisyb/baseui-svelte/${match[2]}';`)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join('\n');

  const script = imports ? `<script lang="ts">\n${imports}\n</script>` : '';
  const translated = script
    .concat(script && body ? '\n\n' : '', body)
    .replaceAll('className=', 'class=')
    .replace(/\{styles\.([A-Za-z0-9_]+)\}/g, '"$1"')
    .replace(/<PlusIcon\s+class="([^"]+)"\s*\/>/g, '<svg class="$1" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h13M8 14.5v-13" /></svg>')
    .replaceAll('React components', 'Svelte components')
    .replace(/^\s*import \* as React from 'react';\s*$/gm, '')
    .replace(/<React\.Fragment(?:\s+[^>]*)?>/g, '')
    .replaceAll('</React.Fragment>', '')
    .replaceAll(' as React.CSSProperties', '')
    .replaceAll('"/react/', '"/svelte/')
    .replaceAll("'/react/", "'/svelte/")
    .replace(/\/>/g, ' />');

  try {
    compileSvelte(translated, { generate: false });
    return translated;
  } catch {
    // React callback children and JSX-valued render props do not have a safe
    // mechanical Svelte equivalent. Render the same component tree as valid,
    // static Svelte instead of publishing broken pseudo-Svelte/TSX.
    const staticBody = jsxPreview(source, '', true)
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return script.concat(script && staticBody ? '\n\n' : '', staticBody);
  }
}

async function fetchText(fetcher: typeof fetch, url: string) {
  const response = await fetcher(url);
  return response.ok ? response.text() : '';
}

const copyIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="square" d="M1.5 1.5h10v10h-10z"/><path stroke-linecap="square" d="M4.5 11.5h-3v-10h10v3"/><path d="M12 4.5h2.5v10h-10V12"/></svg>';
const checkIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="m2.5 8.5 4 4 7-9"/></svg>';
const externalLinkIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="square" stroke-linejoin="round" d="m4 12 8-8"/><path d="M5 3.5h7.5V11"/></svg>';
const githubIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.57983 0 0 3.67031 0 8.20221c0 3.62969 2.29009 6.69509 5.46991 7.78139.4.072.54957-.174.54957-.3894 0-.1947-.00974-.8402-.00974-1.5278-2.00974.3795-2.52939-.5021-2.68939-.9628-.09044-.2361-.48-.9643-.82087-1.1591-.27965-.1541-.67965-.5334-.00974-.5434.63026-.01 1.08035.5948 1.23061.8409.72 1.241 1.86991.8915 2.32974.6761.06956-.5328.27965-.8915.50991-1.0969-1.78017-.2047-3.63965-.9122-3.63965-4.04979 0-.89154.30956-1.62974.81948-2.20389-.08-.20542-.35966-1.04632.08-2.17395 0 0 .66991-.21539 2.20034.84091.64-.18473 1.31966-.27674 2-.27674.67966 0 1.36.09272 2.00003.27674 1.5304-1.06629 2.1996-.84091 2.1996-.84091.4404 1.12763.16 1.96853.08 2.17395.5099.57415.8202 1.30165.8202 2.20389 0 3.14759-1.8699 3.84439-3.65004 4.04979.29004.2567.53974.7489.53974 1.5177 0 1.097-.00975 1.9785-.00975 2.2553 0 .2154.15035.4721.54965.3902C13.7107 14.8973 16 11.8212 16 8.20221 16 3.67031 12.4202 0 8 0"/></svg>';
const moreIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9.5 13c0 .8284-.67157 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.67157-1.5 1.5-1.5 1.5.6716 1.5 1.5m0-5c0 .82843-.67157 1.5-1.5 1.5S6.5 8.82843 6.5 8 7.17157 6.5 8 6.5s1.5.67157 1.5 1.5m0-5c0 .82843-.67157 1.5-1.5 1.5S6.5 3.82843 6.5 3 7.17157 1.5 8 1.5s1.5.67157 1.5 1.5"/></svg>';
const selectIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11 10H5l3 3.5zm0-4H5l3-3.5z"/></svg>';

interface DemoVariant {
  id: string;
  label: string;
  collapsible: boolean;
  preview: string;
  scopedCss: string;
  files: Array<{ name: string; language: string; code: string; highlighted: string }>;
}

async function loadDemoVariant(
  fetcher: typeof fetch,
  baseUrl: string,
  demoName: string,
  id: string,
  label: string,
): Promise<DemoVariant | null> {
  const sourceUrl = `${baseUrl}/${id}/index.tsx`;
  const source = await fetchText(fetcher, sourceUrl);
  if (!source) return null;

  const cssImport = source.match(/import styles from '([^']+)'/)?.[1];
  let css = '';
  if (cssImport) css = await fetchText(fetcher, new URL(cssImport, sourceUrl).href);
  const displayCss = css;
  const cssModulePrefix = cssImport ? `${demoName}__` : '';
  const cssModuleClasses = [...source.matchAll(/styles\.([A-Za-z_][A-Za-z0-9_]*)/g)]
    .map((match) => match[1])
    .filter((className, index, classes) => classes.indexOf(className) === index);
  for (const className of cssModuleClasses) {
    css = css.replace(new RegExp(`\\.${className}\\b`, 'g'), `.${cssModulePrefix}${className}`);
  }
  const scopedCss = css.replace(
    /(^|\n)(\s*)(\.[A-Za-z_][A-Za-z0-9_-]*)/g,
    `$1$2[data-demo="${demoName}"] $3`,
  );
  const translated = translateDemoSource(source);
  const files = [{
    name: 'index.svelte',
    language: 'svelte',
    code: translated,
    highlighted: await highlightCode(translated, 'svelte'),
  }];
  if (displayCss) {
    files.push({
      name: 'index.module.css',
      language: 'css',
      code: displayCss,
      highlighted: await highlightCode(displayCss, 'css'),
    });
  }

  return {
    id,
    label,
    collapsible: source.trimEnd().split('\n').length >= 8,
    scopedCss,
    preview: jsxPreview(
      source
        .replaceAll('React components', 'Svelte components')
        .replaceAll('"/react/', '"/svelte/')
        .replaceAll("'/react/", "'/svelte/"),
      cssModulePrefix,
    ),
    files,
  };
}

function demoToolbarActions(variants: DemoVariant[], selected: DemoVariant, sourceUrl: string) {
  const variantSelector = variants.length > 1
    ? `<div class="DemoVariantSelector"><button class="GhostButton" type="button" role="combobox" aria-label="Styling method" aria-haspopup="listbox" aria-expanded="false" data-demo-action="variant"><span>${selected.label}</span>${selectIcon}</button><div class="DemoVariantPopup" role="listbox" aria-label="Styling method" tabindex="-1" hidden>${variants.map((variant) => `<button type="button" role="option" aria-selected="${variant === selected}" tabindex="${variant === selected ? '0' : '-1'}" data-demo-variant-option="${variant.id}"${variant === selected ? ' data-highlighted' : ''}><span class="DemoVariantIndicator"${variant === selected ? '' : ' hidden'}>${checkIcon}</span><span class="DemoVariantText">${variant.label}</span></button>`).join('')}</div></div>`
    : '';
  return `${variantSelector}<button class="GhostButton" type="button" aria-label="Open in StackBlitz" data-demo-action="stackblitz">StackBlitz${externalLinkIcon}</button><div class="DemoMore"><button class="GhostButton" data-layout="icon" type="button" aria-label="More actions" aria-haspopup="menu" aria-expanded="false" data-demo-action="more">${moreIcon}</button><div class="DemoMorePopup" role="menu" tabindex="-1" hidden><a role="menuitem" tabindex="-1" href="${sourceUrl}" target="_blank" rel="noopener">${githubIcon}View source on GitHub${externalLinkIcon}</a><button type="button" role="menuitem" tabindex="-1" data-demo-action="copy-source"><span class="DemoCopySourceIcon">${copyIcon}</span>Copy link to source</button></div></div>`;
}

async function renderDemo(fetcher: typeof fetch, pagePath: string, importPath: string, name: string) {
  const demoPath = importPath.replace(/^\.\//, '');
  const baseUrl = `${DOCS_SOURCE_ROOT}/${pagePath}/${demoPath}`;
  const variants = (await Promise.all([
    loadDemoVariant(fetcher, baseUrl, name, 'css-modules', 'CSS Modules'),
    loadDemoVariant(fetcher, baseUrl, name, 'tailwind', 'Tailwind v4'),
  ])).filter((variant): variant is DemoVariant => variant !== null);
  if (!variants.length) return '';

  const selected = variants[0];
  const visualVariant = variants.find((variant) => variant.id === 'css-modules') ?? selected;
  const sourceUrl = `https://github.com/itisyb/baseui-svelte/tree/main/src/lib/${pagePath.split('/').at(-1)}`;
  // The styling-method switch changes the source files. The rendered example
  // stays visually identical, as it does upstream; CSS Modules provides the
  // deterministic preview while Tailwind source is still shown verbatim.
  const previews = variants.map((variant) => `<div class="DemoVariantPreview" data-demo-variant="${variant.id}"${variant === selected ? '' : ' hidden'}><style>${visualVariant.scopedCss}</style><div class="DemoPreview">${visualVariant.preview}</div></div>`).join('');
  const tabLists = variants.map((variant) => `<div class="DemoTabsRoot" data-demo-variant-tabs="${variant.id}"${variant === selected ? '' : ' hidden'}><div class="DemoTabsList" role="tablist" aria-label="Files">${variant.files.map((file, index) => `<a class="DemoTab" id="${slug(name)}:${variant.id}:${file.name}:tab" href="#${slug(name)}:${variant.id}:${file.name}" role="tab" aria-controls="${slug(name)}:${variant.id}:${file.name}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}" data-demo-file="${file.name}"${index === 0 ? ' data-active=""' : ''}><span>${file.name}</span></a>`).join('')}</div></div>`).join('');
  const codePanels = variants.flatMap((variant) => variant.files.map((file, index) => `<pre class="DemoCode" id="${slug(name)}:${variant.id}:${file.name}" role="tabpanel" aria-labelledby="${slug(name)}:${variant.id}:${file.name}:tab" data-demo-code-variant="${variant.id}" data-demo-code-file="${file.name}"${variant === selected && index === 0 ? '' : ' hidden'}><code class="language-${file.language}">${file.highlighted}</code></pre>`)).join('');
  const actions = demoToolbarActions(variants, selected, sourceUrl);
  const html = `<div class="DemoRoot" data-demo="${name}" data-selected-variant="${selected.id}" data-source-url="${sourceUrl}"${selected.collapsible ? ' data-demo-collapsible=""' : ''}>
${previews}
<div class="DemoCollapsibleRoot" role="figure" aria-label="Component demo code">
<div class="DemoToolbar"><div class="DemoToolbarScrollAreaRoot"><div class="DemoToolbarViewport">${tabLists}<div class="DemoToolbarActions DemoToolbarActionsMobile">${actions}</div></div></div><div class="DemoToolbarActions DemoToolbarActionsDesktop">${actions}</div></div>
<div class="DemoCodeBlockRoot">${codePanels}<button class="GhostButton DemoCodeBlockCopyButton" data-layout="icon" type="button" aria-label="Copy code">${copyIcon}</button><button class="DemoShowCode" type="button"><span class="DemoCollapseButtonVisual">Show code</span></button></div>
</div></div>`;
  return `\n<!--DEMO:${encodeURIComponent(html)}-->\n`;
}

async function protectCodeFences(markdown: string) {
  const pattern = /```([A-Za-z0-9_-]+)?(?:\s+title="([^"]+)")?\s*\n([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(pattern)];
  for (const match of matches) {
    const [source, language = '', title = '', rawCode] = match;
    const code = rawCode.replace(/\n$/, '');
    const highlighted = await highlightCode(code, language);
    const html = `<figure class="CodeFrame${title ? '' : ' CodeFrameUntitled'}">${title ? `<figcaption>${escapeHtml(title)}<button type="button" aria-label="Copy code"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor"/><path d="M10.5 5.5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" stroke="currentColor"/></svg></button></figcaption>` : ''}<pre><code class="language-${escapeHtml(language)}">${highlighted}</code></pre></figure>`;
    markdown = markdown.replace(source, `\n<!--RAW:${encodeURIComponent(html)}-->\n`);
  }
  return markdown;
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
    .replace(/^<InstallationBlock\b[^>]*\bpackage="([^"]+)"[^>]*\/>\s*$/gm, (_match, packageName: string) => {
      const html = installationBlock(packageName.replace('@base-ui/react', '@itisyb/baseui-svelte'));
      return `\n<!--RAW:${encodeURIComponent(html)}-->\n`;
    })
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

function stripTopLevelImports(markdown: string) {
  const lines = markdown.split('\n');
  const kept: string[] = [];
  let fence: string | null = null;
  let importDeclaration = false;

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      fence = fence === null ? fenceMatch[1][0] : fence === fenceMatch[1][0] ? null : fence;
      kept.push(line);
      continue;
    }
    if (fence !== null) {
      kept.push(line);
      continue;
    }
    if (!importDeclaration && /^\s*import\b/.test(line)) importDeclaration = true;
    if (importDeclaration) {
      if (/;\s*$/.test(line)) importDeclaration = false;
      continue;
    }
    kept.push(line);
  }
  return kept.join('\n');
}

function stripMdx(markdown: string) {
  return stripTopLevelImports(markdown)
    .replace(/\nexport const metadata = \{[\s\S]*$/m, '')
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
    .replaceAll('.tsx', '.svelte')
    .replaceAll('.jsx', '.svelte')
    .replaceAll('{/* prettier-ignore */}', '<!-- prettier-ignore -->')
    .replaceAll('{children}', '{@render children()}')
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
  let insideAdditionalTypes = false;
  for (const match of html.matchAll(/<h([2-3]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)) {
    const depth = Number(match[1]);
    const text = match[3].replace(/<[^>]+>/g, '').replaceAll('&nbsp;', '\u00a0');
    if (depth === 2) {
      insideAdditionalTypes = text.toLowerCase() === 'additional types';
      if (insideAdditionalTypes) continue;
    } else if (insideAdditionalTypes) continue;

    headings.push({
      depth,
      id: match[2],
      text,
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

function tableCells(row: string) {
  return [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((match) => match[1].trim());
}

function plainText(html: string) {
  return unescapeHtml(html.replace(/<[^>]+>/g, '').replaceAll('&#xA;', ' ')).trim();
}

function referenceIcon() {
  return '<span class="ReferenceIconWrap"><svg class="AccordionIcon ReferenceIcon" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" /></svg></span>';
}

function referenceType(value: string) {
  const text = plainText(value);
  let display = text;
  if (text.includes('=>')) {
    const base = text.match(/^([^|]+)\s*\|/)?.[1]?.trim();
    display = base && !base.startsWith('((') ? `${base} | function` : 'function';
  }
  const parts = display.split(/(\s*\|\s*)/);
  return `<code>${parts.map((part) => {
    const token = part.trim();
    if (token === '|') return ' <span class="ReferenceTypeOperator">|</span> ';
    const className = token === 'boolean' || token === 'number' ? 'ReferenceTypePrimitive'
      : token === 'function' ? 'ReferenceTypeFunction'
      : /^['"].*['"]$/.test(token) ? 'ReferenceTypeString'
      : 'ReferenceTypeIdentifier';
    return `<span class="${className}">${escapeHtml(token)}</span>`;
  }).join('')}</code>`;
}

function referenceDefault(value: string) {
  const text = plainText(value);
  const className = /^(?:true|false|\d+(?:\.\d+)?)$/.test(text) ? 'ReferenceTypePrimitive'
    : /^['"].*['"]$/.test(text) ? 'ReferenceTypeString'
    : '';
  return className ? `<code><span class="${className}">${escapeHtml(text)}</span></code>` : value;
}

function referencePropsTable(table: string, label: string) {
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((match) => tableCells(match[1]));
  const items = rows.map((cells) => {
    const [name = '', type = '', defaultValue = '', description = ''] = cells;
    const shortType = referenceType(type);
    const shortDefault = referenceDefault(defaultValue);
    const accessibleName = `${plainText(name)}, type: ${plainText(shortType)}, default: ${plainText(shortDefault)}`;
    return `<details class="AccordionItem"><summary class="AccordionTrigger ReferenceTrigger" aria-label="${escapeHtml(accessibleName)}"><span class="AccordionScrollable ReferenceNameCell"><span class="AccordionScrollableInner">${name}</span></span><span class="AccordionScrollable ReferenceTypeCell"><span class="AccordionScrollableInner">${shortType}</span></span><span class="AccordionScrollable ReferenceDefaultCell"><span class="AccordionScrollableInner">${shortDefault}</span></span>${referenceIcon()}</summary><div class="AccordionPanel"><div class="AccordionContent"><dl class="ReferenceContent" aria-label="Info"><div><dt>Name</dt><dd>${name}</dd></div><div><dt>Description</dt><dd>${description}</dd></div><div><dt>Type</dt><dd>${type}</dd></div><div><dt>Default</dt><dd>${defaultValue}</dd></div></dl></div></div></details>`;
  }).join('');
  return `<section class="AccordionRoot ReferenceAccordionRoot ReferenceBlockSpaced" aria-label="${escapeHtml(label)}" style="--rows:${rows.length}"><div class="AccordionHeaderRow ReferenceHeaderRow" aria-hidden="true"><div class="AccordionHeaderCell"><span class="AccordionHeaderCellInner">Prop</span></div><div class="AccordionHeaderCell ReferenceHeaderTypeCell"><span class="AccordionHeaderCellInner">Type</span></div><div class="AccordionHeaderCell ReferenceHeaderDefaultCell"><span class="AccordionHeaderCellInner">Default</span></div><div class="AccordionHeaderCell ReferenceHeaderIconCell"></div></div>${items}</section>`;
}

function referenceDataTable(table: string, label: string) {
  const headerRow = table.match(/<thead>[\s\S]*?<tr>([\s\S]*?)<\/tr>[\s\S]*?<\/thead>/)?.[1] ?? '';
  const headers = tableCells(headerRow);
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((match) => tableCells(match[1]));
  const firstHeader = headers[0] ?? (label.includes('CSS') ? 'CSS Variable' : 'Attribute');
  const renderedRows = rows.map(([name = '', _type = '', description = '']) =>
    `<tr class="TableRow"><th class="TableCell" scope="row"><div class="TableCellInner"><code class="Code TableCode">${name}</code></div></th><td class="TableCell" colspan="2"><div class="TableCellInner"><p class="MdP">${description}</p></div></td></tr>`,
  ).join('');
  return `<div class="TableRoot ReferenceTableRoot ReferenceBlockSpaced" style="--rows:${rows.length}"><table class="TableRootTable" aria-label="${escapeHtml(label)}"><thead class="TableHead"><tr class="TableRow"><th class="TableColumnHeader ReferenceWideNameColumn" scope="col"><div class="TableCellInner">${firstHeader}</div></th><th class="TableColumnHeader ReferenceWideDescriptionColumn" scope="col"><div class="TableCellInner">Description</div></th><th class="TableColumnHeader ReferenceHeaderIconCell" aria-hidden="true"><span class="VisuallyHidden">-</span></th></tr></thead><tbody class="TableBody">${renderedRows}</tbody></table></div>`;
}

function enhanceReferenceTables(html: string) {
  return html.replace(/<p><strong>([^<]+):<\/strong><\/p>\s*(<table>[\s\S]*?<\/table>)/g, (_match, label: string, table: string) => {
    if (/\bProps$/.test(label)) return referencePropsTable(table, label);
    if (/\b(?:Data Attributes|CSS Variables)$/.test(label)) return referenceDataTable(table, label);
    return table;
  });
}

async function renderMarkdown(markdown: string) {
  markdown = await protectCodeFences(markdown);
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
  const html = enhanceReferenceTables(rendered.join('')
    .replace(/<!--DEMO:([\s\S]*?)-->/g, (_match, encoded: string) => decodeURIComponent(encoded))
    .replace(/<!--RAW:([\s\S]*?)-->/g, (_match, encoded: string) => decodeURIComponent(encoded)));
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
