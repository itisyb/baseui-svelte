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

  const firstTabBox = await fileTabs.nth(0).boundingBox();
  expect(firstTabBox).not.toBeNull();
  await page.mouse.move(firstTabBox!.x + firstTabBox!.width / 2, firstTabBox!.y + firstTabBox!.height / 2);
  await page.mouse.down();
  await expect.poll(async () => fileTabs.nth(0).evaluate((tab) => ({
    color: getComputedStyle(tab).color,
    background: getComputedStyle(tab).backgroundColor,
  }))).toEqual({ color: 'rgb(230, 230, 230)', background: 'rgba(0, 0, 0, 0)' });
  await page.mouse.up();

  await page.keyboard.press('Tab');
  await fileTabs.nth(0).focus();
  await expect.poll(async () => fileTabs.nth(0).evaluate((tab) => ({
    focusVisible: tab.matches(':focus-visible'),
    radius: getComputedStyle(tab).borderRadius,
    outlineOffset: getComputedStyle(tab).outlineOffset,
  }))).toEqual({ focusVisible: true, radius: '0px', outlineOffset: '-2px' });

  const reference = page.locator('.ReferenceAccordionRoot').first();
  await expect(reference).toBeVisible();
  await expect.poll(async () => reference.boundingBox()).toMatchObject({ width: 768, height: 534 });
  await expect(reference.locator('.AccordionItem')).toHaveCount(12);

  await page.reload();
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');
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
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');

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

test('keeps modal overlays above the complete demo shell', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));
  await page.goto('/svelte/components/alert-dialog');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');

  const trigger = page.getByRole('button', { name: 'Discard draft' }).first();
  await trigger.click();
  const dialog = page.getByRole('alertdialog', { name: 'Discard draft?' }).first();
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect.poll(async () => dialog.boundingBox()).toMatchObject({
    x: 528,
    y: 453,
    width: 384,
    height: 130,
  });
  await expect.poll(() => page.evaluate(() => {
    const topmost = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return topmost?.closest('[role="alertdialog"]') !== null;
  })).toBe(true);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

  await page.goto('/svelte/components/drawer');
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');
  const drawerTrigger = page.getByRole('button', { name: 'Open drawer', exact: true }).first();
  await drawerTrigger.click();
  const drawer = page.getByRole('dialog', { name: 'Drawer', exact: true }).first();
  await expect(drawer).toBeVisible();
  await expect(drawer).toBeFocused();
  await expect.poll(() => drawer.evaluate((element) => getComputedStyle(element).transform), { timeout: 10_000 }).toBe('none');
  await expect.poll(async () => drawer.boundingBox()).toMatchObject({
    x: 1120,
    y: 0,
    width: 368,
    height: 1100,
  });
  await expect.poll(() => page.evaluate(() => {
    const topmost = document.elementFromPoint(window.innerWidth - 20, window.innerHeight / 2);
    return topmost?.closest('[role="dialog"]') !== null;
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(drawerTrigger).toBeFocused();
});

test('matches floating overlay geometry and interaction behavior', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'));

  await page.goto('/svelte/components/popover');
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');
  const popoverTrigger = page.getByRole('button', { name: 'Notifications', exact: true }).first();
  await popoverTrigger.click();
  const popover = page.getByRole('dialog', { name: 'Notifications' }).first();
  await expect.poll(async () => popover.boundingBox()).toMatchObject({
    x: 609,
    y: 303,
    width: 222.9375,
    height: 70,
  });
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(popoverTrigger).toBeFocused();

  await page.goto('/svelte/components/combobox');
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');
  const comboboxRoot = page.locator('.DemoRoot').first();
  await comboboxRoot.getByRole('button', { name: 'Open popup' }).click();
  const listbox = comboboxRoot.getByRole('listbox');
  await expect.poll(async () => listbox.boundingBox()).toMatchObject({
    x: 609,
    y: 312,
    width: 222,
    height: 360,
  });
  await expect(listbox.getByRole('option').first()).toHaveText('Apple');

  await page.goto('/svelte/components/preview-card');
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');
  const previewRoot = page.locator('.DemoRoot').first();
  const preview = previewRoot.locator('.DemoVariantPreview:not([hidden])');
  const previewTrigger = preview.getByRole('link', { name: 'typography', exact: true });
  await previewTrigger.hover();
  const previewPopup = preview.locator('[data-demo-component="PreviewCard.Popup"]');
  await expect(previewPopup).toBeVisible({ timeout: 2_000 });
  await expect.poll(async () => previewPopup.boundingBox()).toMatchObject({ x: 592, y: 300, width: 242 });
  await page.mouse.move(20, 20);
  await expect(previewPopup).toBeHidden();
});

test('walks every demo-toolbar interaction state', async ({ page, context }, testInfo) => {
  test.setTimeout(60_000);
  test.skip(testInfo.project.name.startsWith('mobile'));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/svelte/components/accordion');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.MdContent')).toHaveAttribute('data-demo-enhanced', '');

  const demo = page.locator('.DemoRoot').first();
  const copy = demo.getByRole('button', { name: 'Copy code' });
  await copy.click();
  await expect(copy.locator('path').first()).toHaveAttribute('d', 'm2.5 8.5 4 4 7-9');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("@itisyb/baseui-svelte/accordion");
  await page.waitForTimeout(2100);
  await expect(copy.locator('path').first()).toHaveAttribute('d', 'M1.5 1.5h10v10h-10z');

  const referenceCopy = page.locator('.CodeFrame').getByRole('button', { name: 'Copy code' });
  await expect.poll(async () => referenceCopy.boundingBox()).toMatchObject({ width: 28, height: 28 });
  await referenceCopy.click();
  await expect(referenceCopy.locator('path')).toHaveAttribute('d', 'm2.5 8.5 4 4 7-9');

  const variant = demo.getByRole('combobox', { name: 'Styling method' });
  await variant.click();
  await expect(variant).toHaveAttribute('aria-expanded', 'true');
  const listbox = demo.getByRole('listbox', { name: 'Styling method' });
  await expect(listbox).toBeVisible();
  await expect.poll(async () => listbox.boundingBox()).toMatchObject({
    x: 822.5625,
    y: 391.203125,
    width: 138.859375,
    height: 64,
  });
  await expect(listbox.getByRole('option', { name: 'CSS Modules' }).locator('.DemoVariantIndicator path')).toHaveAttribute('d', 'm2.5 8.5 4 4 7-9');
  await page.keyboard.press('ArrowDown');
  await expect(listbox.getByRole('option', { name: 'Tailwind v4' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(variant).toContainText('Tailwind v4');
  await expect(demo.getByRole('tab')).toHaveCount(1);

  const more = demo.getByRole('button', { name: 'More actions' });
  await more.click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  const menu = demo.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect.poll(async () => menu.boundingBox()).toMatchObject({
    x: 894,
    y: 431,
    width: 206.046875,
    height: 64,
  });
  await expect(menu.getByRole('menuitem', { name: /View source on GitHub/ })).toHaveAttribute('href', /github\.com\/itisyb\/baseui-svelte/);
  const copySource = menu.getByRole('menuitem', { name: 'Copy link to source' });
  await copySource.click();
  await expect(menu).toBeVisible();
  await expect(copySource.locator('.DemoCopySourceIcon path')).toHaveAttribute('d', 'm2.5 8.5 4 4 7-9');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('github.com/itisyb/baseui-svelte');
  await page.waitForTimeout(2100);
  await expect(copySource.locator('.DemoCopySourceIcon path').first()).toHaveAttribute('d', 'M1.5 1.5h10v10h-10z');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(more).toBeFocused();

  const hideCode = demo.locator('.DemoShowCode');
  await expect(hideCode).toHaveText('Hide code');
  await expect(demo).toHaveClass(/DemoCodeExpanded/);
  await hideCode.click();
  await expect(hideCode).toHaveText('Show code');
  await expect(demo).not.toHaveClass(/DemoCodeExpanded/);
  await hideCode.click();
  await expect(hideCode).toHaveText('Hide code');

  const opened: string[] = [];
  await page.evaluate(() => {
    window.open = ((url?: string | URL) => {
      document.documentElement.dataset.openedUrl = String(url ?? '');
      return null;
    }) as typeof window.open;
  });
  await demo.getByRole('button', { name: 'Open in StackBlitz' }).click();
  opened.push(await page.locator('html').getAttribute('data-opened-url') ?? '');
  expect(opened).toEqual(['https://stackblitz.com/fork/svelte?file=src%2FApp.svelte']);
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
