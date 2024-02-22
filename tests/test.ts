import { expect, test } from '@playwright/test';

// test('why-svelteplot', async ({ page }) => {
//     await page.goto('/why-svelteplot');
//     await expect(page.getByTestId('olympians')).toHaveScreenshot();
//     // await expect(page.getByTestId('olympians-binned')).toHaveScreenshot();
//     // await expect(page.getByTestId('olympians-hist')).toHaveScreenshot();
//     // await expect(page.getByTestId('olympians-hist-facet')).toHaveScreenshot();
// });

test('getting-started', async ({ page }) => {
    await page.goto('/getting-started');
    await expect(page.getByTestId('four-bars')).toHaveScreenshot();
});

test('features/plot', async ({ page }) => {
    await page.goto('/features/plot');
    await expect(page.getByTestId('aapl-line-frame')).toHaveScreenshot();
    await expect(page.getByTestId('ggplot')).toHaveScreenshot();
    await expect(page.getByTestId('with-title')).toHaveScreenshot();
});

// test('features/scales', async ({ page }) => {
//     await page.goto('/features/scales');
//     await expect(page.getByTestId('linear')).toHaveScreenshot();
//     await expect(page.getByTestId('reverse')).toHaveScreenshot();
//     await expect(page.getByTestId('time')).toHaveScreenshot();
//     await expect(page.getByTestId('log-scales')).toHaveScreenshot();
//     await expect(page.getByTestId('axis-off')).toHaveScreenshot();
// });

// test('marks/area', async ({ page }) => {
//     await page.goto('/marks/area');
//     await expect(page.getByTestId('area-line-rule')).toHaveScreenshot();
//     await expect(page.getByTestId('area-y1')).toHaveScreenshot();
//     await expect(page.getByTestId('area-y2')).toHaveScreenshot();
//     await expect(page.getByTestId('area-y-numbers')).toHaveScreenshot();
//     await expect(page.getByTestId('area-x')).toHaveScreenshot();
// });

// test('marks/rect', async ({ page }) => {
//     await page.goto('/marks/rect');
//     await expect(page.getByTestId('seattle-temp')).toHaveScreenshot();
// });

// test('marks/dot', async ({ page }) => {
//     await page.goto('/marks/dot');
//     await expect(page.getByTestId('cars')).toHaveScreenshot();
//     await expect(page.getByTestId('penguins')).toHaveScreenshot();
//     await expect(page.getByTestId('dotx')).toHaveScreenshot();
//     await expect(page.getByTestId('doty')).toHaveScreenshot();
// });

// test('marks/line', async ({ page }) => {
//     await page.goto('/marks/line');
//     await expect(page.getByTestId('aapl')).toHaveScreenshot();
//     await expect(page.getByTestId('bls')).toHaveScreenshot();
//     await expect(page.getByTestId('curvedemo')).toHaveScreenshot();
//     await expect(page.getByTestId('linex')).toHaveScreenshot();
//     await expect(page.getByTestId('liney')).toHaveScreenshot();
// });

// test('marks/frame', async ({ page }) => {
//     await page.goto('/marks/frame');
//     await expect(page.getByTestId('frame-demo')).toHaveScreenshot();
// });

// test('marks/grid', async ({ page }) => {
//     await page.goto('/marks/grid');
//     await expect(page.getByTestId('grid')).toHaveScreenshot();
//     await expect(page.getByTestId('custom')).toHaveScreenshot();
//     await expect(page.getByTestId('tickspacing')).toHaveScreenshot();
//     await expect(page.getByTestId('grid-x')).toHaveScreenshot();
//     await expect(page.getByTestId('grid-y')).toHaveScreenshot();
// });

// test('marks/rule', async ({ page }) => {
//     await page.goto('/marks/rule');
//     await expect(page.getByTestId('rule-annotations')).toHaveScreenshot();
//     await expect(page.getByTestId('candlestick')).toHaveScreenshot();
//     await expect(page.getByTestId('barcode')).toHaveScreenshot();
//     await expect(page.getByTestId('sine')).toHaveScreenshot();
// });
