import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/react/components');
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

test('does not link to absent local component pages', async ({ page }) => {
  const missingLocalLinks = await page.locator('a').evaluateAll((links) =>
    links
      .map((link) => (link as HTMLAnchorElement).getAttribute('href'))
      .filter((href) => href?.startsWith('/react/components/')),
  );

  expect(missingLocalLinks).toEqual([]);
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
