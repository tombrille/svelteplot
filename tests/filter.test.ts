import { expect, test } from '@playwright/test';

['area', 'axis', 'groupy', 'grid', 'dot', 'line', 'rectx', 'recty', 'rule', 'text', 'tickx', 'ticky'].forEach((id) => {
    test(id, async ({ page }) => {
        await page.goto('/tests/filter');
        await expect(page.getByTestId(id)).toHaveScreenshot();
    });
});
