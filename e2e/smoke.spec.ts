import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('app shell renders and has no axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Order Explorer' })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('dev server hosts the Vercel function', async ({ request }) => {
  const response = await request.get('/api/ping');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ ok: true });
});
