import { expect, test } from '@playwright/test';

['area', 'dot', 'line', 'regression', 'rectx', 'recty', 'rulex', 'ruley', 'text'].forEach((id) => {
    test(id, async ({ page }) => {
        await page.goto('/tests/facets');
        await expect(page.getByTestId(id)).toHaveScreenshot();
    });
});
