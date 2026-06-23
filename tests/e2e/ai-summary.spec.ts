import { test, expect } from "@playwright/test";

test.describe("AI Summary Feature", () => {
  test("AI-001: Sparkles button not visible on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const aiButton = page.getByLabel("AI Summary").or(
      page.locator('button:has-text("AI Summary")'),
    );
    await expect(aiButton).not.toBeVisible();
  });

  test("AI-002: Sparkles button not visible on /posts", async ({ page }) => {
    await page.goto("/posts");
    await page.waitForTimeout(1000);
    const aiButton = page.getByLabel("AI Summary").or(
      page.locator('button:has-text("AI Summary")'),
    );
    await expect(aiButton).not.toBeVisible();
  });

  test("AI-003: Sparkles button visible on post page when post exists", async ({ page }) => {
    await page.goto("/posts");
    await page.waitForTimeout(2000);

    // Try to find a post link on the posts listing page
    const postLink = page.locator("a[href*='/posts/']").first();
    if (await postLink.isVisible({ timeout: 3000 })) {
      const href = await postLink.getAttribute("href");
      await postLink.click();
      await page.waitForURL(`**${href}`);
      await page.waitForTimeout(2000);

      // Scroll down to make FloatingButtonGroup visible (hidden until scroll.y > 0)
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
      await page.waitForTimeout(500);

      const aiButton = page.getByLabel("AI Summary");
      await expect(aiButton).toBeVisible({ timeout: 5000 });

      // Click the AI Summary button
      await aiButton.click();
      await page.waitForTimeout(1000);

      // Popup should show with title "AI Summary"
      const popup = page.getByText("AI Summary").first();
      await expect(popup).toBeVisible({ timeout: 3000 });
    }
  });
});
