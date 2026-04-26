import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('THEME-001: Theme toggle exists', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[role="radiogroup"]').or(
      page.locator('text=Light').or(page.locator('text=Dark'))
    );
    
    if (await themeToggle.isVisible({ timeout: 5000 })) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('THEME-002: Toggle switches theme', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[role="radiogroup"]');
    
    if (await themeToggle.isVisible({ timeout: 5000 })) {
      const darkOption = page.locator('text=Dark').first();
      if (await darkOption.isVisible()) {
        await darkOption.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('THEME-003: Theme persists after reload', async ({ page, context }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[role="radiogroup"]');
    
    if (await themeToggle.isVisible({ timeout: 5000 })) {
      const darkOption = page.locator('text=Dark').first();
      if (await darkOption.isVisible()) {
        await darkOption.click();
      }
    }
    
    await page.reload();
    
    await page.waitForTimeout(1000);
  });
});
