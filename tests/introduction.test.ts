import { expect, test } from '@playwright/test';

test('introduction', async ({ page }) => {
    await page.goto('/introduction');
    await expect(page.getByTestId('olympians')).toHaveScreenshot();
    await expect(page.getByTestId('olympians-binned')).toHaveScreenshot();
    await expect(page.getByTestId('olympians-hist')).toHaveScreenshot();
    await expect(page.getByTestId('olympians-hist-facet')).toHaveScreenshot();
});
