import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import BarYTest from './barY.test.svelte';
import ResizeObserver from 'resize-observer-polyfill';
import { groupBy } from 'es-toolkit';
import { stackY } from '$lib/index.js';

global.ResizeObserver = ResizeObserver;

describe('BarY mark', () => {
    it('simple bar chart from number array', () => {
        const { container } = render(BarYTest, {
            props: {
                plotArgs: {},
                barArgs: {
                    data: [1, 2, 3, 4, 5]
                }
            }
        });

        const bars = container.querySelectorAll('g.bar-y > path') as NodeListOf<SVGPathElement>;
        expect(bars.length).toBe(5);
        const barDims = Array.from(bars).map(getDims);
        // check that bar widths are equal
        expect(barDims[1].w).toBe(barDims[0].w);
        expect(barDims[2].w).toBe(barDims[0].w);
        expect(barDims[3].w).toBe(barDims[0].w);
        expect(barDims[1].h).toBe(barDims[0].h * 2);
        expect(barDims[2].h).toBe(barDims[0].h * 3);
        expect(barDims[3].h).toBe(barDims[0].h * 4);
        expect(barDims[4].h).toBe(barDims[0].h * 5);
    });

    it('stacked bar chart', () => {
        // Mock data similar to bundlesizes in the example
        const data = [
            // normal scenario
            { scenario: 'normal', package: 'svelte', size: 10 },
            { scenario: 'normal', package: 'plot', size: 15 },
            { scenario: 'normal', package: 'd3', size: 30 },
            // core scenario
            { scenario: 'core', package: 'svelte', size: 8 },
            { scenario: 'core', package: 'plot', size: 10 },
            { scenario: 'core', package: 'd3', size: 20 },
            // d3 scenario
            { scenario: 'd3', package: 'svelte', size: 6 },
            { scenario: 'd3', package: 'd3', size: 10 }
        ];

        const { container } = render(BarYTest, {
            props: {
                plotArgs: {
                    x: { domain: ['normal', 'core', 'd3'] }
                },
                barArgs: {
                    data,
                    y: 'size',
                    x: 'scenario',
                    fill: 'package',
                    insetTop: 1
                }
            }
        });

        // Check that stacked bars are rendered
        const bars = container.querySelectorAll('g.bar-y > path') as NodeListOf<SVGPathElement>;

        // There should be 9 bars in total (3 packages × 3 scenarios)
        expect(bars.length).toBe(8);

        const barDims = Array.from(bars).map(getDims);

        // group bars by x
        const groups = Object.values(groupBy(barDims, (d) => d.x)).map((bars) =>
            bars.sort((a, b) => b.y - a.y)
        );
        expect(groups[0]).toHaveLength(3);
        expect(groups[1]).toHaveLength(3);
        expect(groups[2]).toHaveLength(2);

        expect(groups[1][0].h).toBe(groups[0][0].h * 2);
        expect(groups[2][0].h).toBe(groups[0][0].h * 3);
    });
});

function getDims(path: SVGPathElement) {
    const r = path?.getAttribute('d')?.match(/H\s*(\d+(?:\.\d+)?)\s*V\s*(\d+(?:\.\d+)?)/m);
    const t = path
        ?.getAttribute('transform')
        ?.match(/translate\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\)/);
    if (!r || !t) return { x: NaN, y: NaN, w: NaN, h: NaN };
    return {
        x: Math.round(+t[1]),
        y: Math.round(+t[2]),
        w: Math.round(+r[1]),
        h: Math.round(+r[2]),
        fill: path.style.fill,
        stroke: path.style.stroke
    };
}
