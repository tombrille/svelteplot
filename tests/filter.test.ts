import { expect, test } from '@playwright/test';

['area', 'axis', 'groupY', 'grid', 'dot', 'line', 'rectx', 'recty', 'rulex', 'ruley', 'text', 'tickx', 'ticky'].forEach((id) => {
    test(id, async ({ page }) => {
        await page.goto('/tests/filter');
        await expect(page.getByTestId(id)).toHaveScreenshot();
    });
});
