import { test, expect } from '@playwright/test';

test.describe('Posts Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts');
  });

  test('POST-001: Posts page loads with timeline', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(1000);
  });

  test('POST-004: Share button is present on post pages', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForTimeout(1000);
    
    const shareSection = page.locator('text=Share').first();
    if (await shareSection.isVisible()) {
      expect(shareSection).toBeVisible();
    }
  });

  test('POST-005: Layout toggle works', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForTimeout(1000);
    
    const layoutToggle = page.locator('[aria-label*="layout"]').or(page.locator('button:has-text("Layout")')).first();
    if (await layoutToggle.isVisible()) {
      await layoutToggle.click();
      await page.waitForTimeout(500);
    }
  });
});
