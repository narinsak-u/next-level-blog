import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('NAV-001: Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/alohadancemeow/i);
  });

  test('NAV-002: Navigate to posts', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Posts');
    await expect(page).toHaveURL('/posts');
  });

  test('NAV-003: Navigate to about', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('NAV-004: 404 page works', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.locator('body')).toBeVisible();
  });
});
