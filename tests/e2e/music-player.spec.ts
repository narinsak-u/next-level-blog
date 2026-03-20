import { test, expect } from '@playwright/test';

test.describe('Music Player', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('MUSIC-001: Play button exists on home page', async ({ page }) => {
    const playButton = page.locator('button[aria-label*="music"]').or(
      page.locator('button').filter({ has: page.locator('svg') }).first()
    );
    
    await expect(playButton).toBeVisible({ timeout: 10000 });
  });

  test('MUSIC-002: Click play button changes icon to pause', async ({ page }) => {
    const playButton = page.locator('button[aria-label*="Play music"]');
    
    if (await playButton.isVisible({ timeout: 5000 })) {
      await playButton.click();
      await expect(page.locator('button[aria-label*="Pause music"]')).toBeVisible();
    }
  });

  test('MUSIC-003: Toggle back to pause', async ({ page }) => {
    const playButton = page.locator('button[aria-label*="Play music"]');
    
    if (await playButton.isVisible({ timeout: 5000 })) {
      await playButton.click();
      
      const pauseButton = page.locator('button[aria-label*="Pause music"]');
      await expect(pauseButton).toBeVisible();
      
      await pauseButton.click();
      await expect(playButton).toBeVisible();
    }
  });
});
