import { expect, test } from '@playwright/test';

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

  const markdown = await request.get('/svelte/components/accordion.md');
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()['content-type']).toContain('text/markdown');
  expect(await markdown.text()).toContain("import * as Accordion from '@itisyb/baseui-svelte/accordion'");

  const firstTrigger = page.locator('.DemoPreview [data-demo-part="Trigger"]').first();
  const firstPanel = page.locator('.DemoPreview [data-demo-part="Panel"]').first();
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
