import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to SveltePlot' })).toBeVisible();
});

test('features/plot page shows a valid plot', async ({ page }) => {
    await page.goto('/features/plot');
    await expect(page.getByTestId('first')).toHaveScreenshot();
    await expect(page.getByTestId('ggplot')).toHaveScreenshot();
    await expect(page.getByTestId('with-title')).toHaveScreenshot();
});

test('marks/area', async ({ page }) => {
    await page.goto('/marks/area');
    await expect(page.getByTestId('area-line-rule')).toHaveScreenshot();
    await expect(page.getByTestId('area-y1')).toHaveScreenshot();
    await expect(page.getByTestId('area-y2')).toHaveScreenshot();
    await expect(page.getByTestId('area-y-numbers')).toHaveScreenshot();
    await expect(page.getByTestId('area-x')).toHaveScreenshot();
});

test('marks/dot', async ({ page }) => {
    await page.goto('/marks/dot');
    await expect(page.getByTestId('cars')).toHaveScreenshot();
    await expect(page.getByTestId('penguins')).toHaveScreenshot();
    await expect(page.getByTestId('dotx')).toHaveScreenshot();
    await expect(page.getByTestId('doty')).toHaveScreenshot();
});

test('marks/line', async ({ page }) => {
    await page.goto('/marks/line');
    await expect(page.getByTestId('aapl')).toHaveScreenshot();
    await expect(page.getByTestId('bls')).toHaveScreenshot();
    await expect(page.getByTestId('curvedemo')).toHaveScreenshot();
    await expect(page.getByTestId('linex')).toHaveScreenshot();
    await expect(page.getByTestId('liney')).toHaveScreenshot();
});
