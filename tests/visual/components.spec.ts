import { expect, test } from '@playwright/test';

const componentSlugs = [
  'accordion', 'alert-dialog', 'autocomplete', 'avatar', 'button', 'checkbox',
  'checkbox-group', 'collapsible', 'combobox', 'context-menu', 'dialog', 'drawer',
  'field', 'fieldset', 'form', 'input', 'menu', 'menubar', 'meter', 'navigation-menu',
  'number-field', 'otp-field', 'popover', 'preview-card', 'progress', 'radio',
  'scroll-area', 'select', 'separator', 'slider', 'switch', 'tabs', 'toast', 'toggle',
  'toggle-group', 'toolbar', 'tooltip',
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/svelte/components');
  await page.evaluate(() => document.fonts.ready);
  const prefix = await page.evaluate(() =>
    /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘' : 'Ctrl+',
  );
  await expect(page.locator('.SearchTriggerDesktop')).toHaveText(`Search (${prefix}k)`);
});

test('matches the Base UI components index', async ({ page }) => {
  await expect(page).toHaveScreenshot('components-index.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixels: 0,
  });
});

test('uses the exact component index text', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();

  const list = page.locator('main article > ul').first();
  await expect(list.getByRole('listitem')).toHaveCount(37);
  await expect(list.getByRole('listitem').first()).toHaveText(
    'Accordion\u00a0— (Outline, Contents)',
  );
  await expect(list.getByRole('listitem').last()).toHaveText(
    'Tooltip\u00a0— (Outline, Contents)',
  );
});

test('keeps every documentation destination local', async ({ page, request }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name.startsWith('mobile'));
  const links = await page.locator('a').evaluateAll((anchors) =>
    anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href')).filter(Boolean),
  );
  const localDocsLinks = [...new Set(links.filter((href) => href?.startsWith('/svelte/')))] as string[];

  expect(localDocsLinks.filter((href) => href.startsWith('/svelte/components/'))).toHaveLength(37);
  expect(links.filter((href) => href?.startsWith('https://base-ui.com/react'))).toEqual([]);

  for (const href of localDocsLinks) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('permanently redirects the React compatibility route', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  const response = await request.get('/react/components/accordion', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('/svelte/components/accordion');
});

test('matches the upstream component-detail geometry and behavior', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  await page.goto('/svelte/components/accordion');
  await page.evaluate(() => document.fonts.ready);

  const expected = [
    ['h1', { x: 336, y: 64, width: 768, height: 43.203125 }],
    ['.Subtitle', { x: 336, y: 111.203125, width: 768, height: 79 }],
    ['.ContentActions', { x: 336, y: 155.203125, width: 265.734375, height: 35 }],
    ['.DemoRoot', { x: 336, y: 214.203125, width: 768, height: 336 }],
  ] as const;
  for (const [selector, box] of expected) {
    await expect.poll(async () => page.locator(selector).first().boundingBox()).toEqual(box);
  }

  await expect(page.locator('a[href^="https://base-ui.com/react"]')).toHaveCount(0);
  await expect(page.locator('.MdContent table').first()).toBeVisible();
  const attributesTable = page.locator('.MdContent table').first();
  await attributesTable.scrollIntoViewIfNeeded();
  await expect.poll(async () => attributesTable.locator('thead th').first().boundingBox()).toMatchObject({ width: 219.984375 });
  await expect(attributesTable.locator('tbody th').first()).toContainText('data-orientation');

  const markdown = await request.get('/svelte/components/accordion.md');
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()['content-type']).toContain('text/markdown');
  expect(await markdown.text()).toContain("import * as Accordion from '@itisyb/baseui-svelte/accordion'");

  const firstTrigger = page.locator('.DemoPreview [data-demo-part="Trigger"]').first();
  const firstPanel = page.locator('.DemoPreview [data-demo-part="Panel"]').first();
  const secondTrigger = page.locator('.DemoPreview [data-demo-part="Trigger"]').nth(1);
  const secondPanel = page.locator('.DemoPreview [data-demo-part="Panel"]').nth(1);
  const demo = page.locator('.DemoRoot').first();
  await expect(demo.locator('.DemoVariantPreview:not([hidden]) [data-demo-part="Trigger"] .DemoIcon')).toHaveCount(3);
  await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(firstPanel).toBeHidden();
  const animationHeights = await page.evaluate(async () => {
    const trigger = document.querySelector<HTMLElement>('.DemoPreview [data-demo-part="Trigger"]')!;
    const panel = document.querySelector<HTMLElement>('.DemoPreview [data-demo-part="Panel"]')!;
    const values: number[] = [];
    trigger.click();
    for (let index = 0; index < 7; index += 1) {
      await new Promise(requestAnimationFrame);
      values.push(panel.getBoundingClientRect().height);
    }
    return values;
  });
  expect(animationHeights[0]).toBe(0);
  expect(animationHeights.some((height) => height > 0 && height < animationHeights.at(-1)!)).toBe(true);
  await expect(firstPanel).toBeVisible();
  await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(firstPanel).toHaveCSS('transition-duration', '0.15s');

  await secondTrigger.click();
  await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(secondPanel).toBeVisible();
  await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(firstPanel).toBeHidden();

  const fileTabs = demo.getByRole('tab');
  await expect(fileTabs).toHaveCount(2);
  await expect(fileTabs.nth(0)).toHaveText('index.svelte');
  await expect(fileTabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(fileTabs.nth(1)).toHaveText('index.module.css');
  await expect(demo.getByRole('combobox', { name: 'Styling method' })).toBeVisible();
  await expect(demo.getByRole('button', { name: 'Open in StackBlitz' })).toBeVisible();
  await expect(demo.getByRole('button', { name: 'More actions' })).toBeVisible();
  await expect(demo.getByRole('button', { name: 'Copy code' })).toBeVisible();
  await expect(demo.locator('.DemoCode [style*="--shiki-light"]')).not.toHaveCount(0);

  await fileTabs.nth(1).click();
  await expect(fileTabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(demo.locator('.DemoCode:not([hidden])')).toContainText('.Accordion');

  const reference = page.locator('.ReferenceAccordionRoot').first();
  await expect(reference).toBeVisible();
  await expect.poll(async () => reference.boundingBox()).toMatchObject({ width: 768, height: 534 });
  await expect(reference.locator('.AccordionItem')).toHaveCount(12);

  await page.reload();
  await expect(page).toHaveScreenshot('accordion-detail.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixels: 0,
  });
});

test('matches the Select popup geometry and selection behavior', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  await page.goto('/svelte/components/select');
  await page.evaluate(() => document.fonts.ready);

  const preview = page.locator('.DemoVariantPreview:not([hidden]) .DemoPreview').first();
  const trigger = preview.locator('[data-demo-part="Trigger"]').first();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const popup = preview.locator('[data-demo-part="Popup"]').first();
  const list = popup.locator('[data-demo-part="List"]');
  await expect.poll(async () => popup.boundingBox()).toMatchObject({ x: 614, y: 270.203125, width: 188, height: 170 });
  await expect.poll(async () => list.boundingBox()).toMatchObject({ x: 615, y: 271.203125, width: 186, height: 168 });
  await expect(list.locator('[data-demo-part="Item"]')).toHaveText([
    'Gala', 'Fuji', 'Honeycrisp', 'Granny Smith', 'Pink Lady',
  ]);

  await list.locator('[data-demo-part="Item"]').nth(1).click();
  await expect(trigger.locator('[data-demo-part="Value"]')).toHaveText('Fuji');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(popup).toBeHidden();
});

test('renders Quick start without MDX or TSX artifacts', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  await page.goto('/svelte/overview/quick-start');
  await page.evaluate(() => document.fonts.ready);

  const article = page.locator('article');
  await expect(article).not.toContainText('InstallationBlock');
  await expect(article).not.toContainText('tsx');
  await expect(article).not.toContainText('className');

  const installation = page.locator('.InstallationBlock');
  await expect(installation).toBeVisible();
  await expect(installation).toContainText('Installation commandpnpmnpmyarnbun');
  await expect(installation).toContainText('npm i @itisyb/baseui-svelte');
  await expect.poll(async () => installation.boundingBox()).toMatchObject({
    x: 336,
    y: 300.203125,
    width: 768,
    height: 74,
  });

  await installation.getByRole('tab', { name: 'pnpm', exact: true }).click();
  await expect(installation).toContainText('pnpm add @itisyb/baseui-svelte');
});

test('keeps every component demo shell structurally complete', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name.startsWith('mobile'));

  for (const component of componentSlugs) {
    const response = await page.goto(`/svelte/components/${component}`);
    expect(response?.status(), component).toBe(200);
    const audit = await page.evaluate(() => {
      const demos = [...document.querySelectorAll<HTMLElement>('.DemoRoot')];
      return {
        demos: demos.length,
        toolbars: demos.filter((demo) => demo.querySelector('.DemoToolbar')).length,
        highlighted: demos.filter((demo) => demo.querySelector('[style*="--shiki-light"]')).length,
        reactArtifacts: demos.filter((demo) => /React\.|from ['"]react['"]|className=/.test(demo.querySelector('.DemoCode')?.textContent ?? '')).length,
        erasedIcons: [...document.querySelectorAll<SVGPathElement>('.DemoPreview svg path')].filter((path) => getComputedStyle(path).d === 'none').length,
        unnamedButtons: [...document.querySelectorAll<HTMLButtonElement>('.DemoPreview button')].filter((button) => !button.textContent?.trim() && !button.getAttribute('aria-label') && !button.closest('label')?.textContent?.trim()).length,
      };
    });
    expect(audit.demos, `${component}: demos`).toBeGreaterThan(0);
    expect(audit.toolbars, `${component}: toolbars`).toBe(audit.demos);
    expect(audit.highlighted, `${component}: Shiki output`).toBe(audit.demos);
    expect(audit.reactArtifacts, `${component}: React artifacts`).toBe(0);
    expect(audit.erasedIcons, `${component}: erased SVG paths`).toBe(0);
    expect(audit.unnamedButtons, `${component}: unnamed buttons`).toBe(0);
  }
});

test('opens and filters the exact Search or Navigation surface', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name.startsWith('mobile');
  const trigger = page.locator(mobile ? '.SearchTriggerMobile' : '.SearchTriggerDesktop');
  await trigger.click();

  const dialog = page.getByRole('dialog', {
    name: mobile ? 'Docs navigation' : 'Search documentation',
  });
  await expect(dialog).toBeVisible();

  const input = dialog.getByRole('combobox', { name: 'Search' });
  if (mobile) {
    await expect(dialog).toBeFocused();
  } else {
    await expect(input).toBeFocused();
  }

  await input.fill('toast');
  await expect(dialog.getByRole('option', { name: /Toast$/ })).toBeVisible();
  await expect(dialog.getByRole('option', { name: /Accordion$/ })).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('matches the open Search or Navigation surface', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name.startsWith('mobile');
  await page.locator(mobile ? '.SearchTriggerMobile' : '.SearchTriggerDesktop').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot('components-navigation-open.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixels: 0,
  });
});

test('opens Search with the platform keyboard shortcut', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
  await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeVisible();
});
