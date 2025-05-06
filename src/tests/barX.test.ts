import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import BarXTest from './barX.test.svelte';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

const testData = [{
    year: '2010',
    low: 2,
    high: 5
}, {
    year: '2011',
    low: 4,
    high: 7
}]

describe('BarX mark', () => {
    it('simple bar chart from number array', () => {
        const { container } = render(BarXTest, {
            props: {
                plotArgs: {},
                barArgs: {
                    data: [1, 2, 3, 4, 5],
                    strokeWidth: d => d
                }
            }
        });

        const bars = container.querySelectorAll('g.bar-x > path') as NodeListOf<SVGPathElement>;
        expect(bars.length).toBe(5);
        const barDims = Array.from(bars).map(getDims);
        // check that bar height are equal
        expect(barDims.map(d => d.h)).toStrictEqual(new Array(5).fill(barDims[0].h))
        // check that bar length match data
        expect(barDims.map(d => d.w)).toStrictEqual([1, 2, 3, 4, 5].map(m => barDims[0].w * m))
        expect(barDims.map(d => d.strokeWidth)).toStrictEqual(['1px', '2px', '3px', '4px', '5px']);
    });

    it('bar chart from objects', () => {
        const { container } = render(BarXTest, {
            props: {
                plotArgs: {},
                barArgs: {
                    data: testData,
                    y: 'year',
                    fill: 'year',
                    x1: 'low',
                    x2: 'high'
                }
            }
        });

        const bars = container.querySelectorAll('g.bar-x > path') as NodeListOf<SVGPathElement>;
        expect(bars.length).toBe(2);
        const barDims = Array.from(bars).map(getDims);
        expect(barDims[0].w).toBe(barDims[1].w);
        expect(barDims[0].x).not.toBe(barDims[1].x);
    })
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
        stroke: path.style.stroke,
        strokeWidth: path.style.strokeWidth,
    };
}
