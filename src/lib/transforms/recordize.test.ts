import { describe, it, expect } from 'vitest';
import { recordizeXY, RAW_VALUE } from './recordize.js';
import type { RawValue } from '$lib/types/index.js';

const coordsArray: [RawValue, RawValue][] = [
    [0, 4],
    [1, 3],
    [2, 2],
    [3, 1]
];

describe('recordizeXY', () => {
    it('converts arrays of numbers into records', () => {
        const { data, ...channels } = recordizeXY({ data: coordsArray });
        expect(data[0]).toStrictEqual({ [RAW_VALUE]: [0, 4], __x: 0, __y: 4 });
        expect(data[1]).toStrictEqual({ [RAW_VALUE]: [1, 3], __x: 1, __y: 3 });
        expect(channels).toStrictEqual({ x: '__x', y: '__y' });
    });

    it("doesn't converts if x channel accessor is set", () => {
        const { data, ...channels } = recordizeXY({ data: coordsArray, x: 0 });
        expect(data[0]).toStrictEqual([0, 4]);
        expect(data[1]).toStrictEqual([1, 3]);
        expect(channels).toStrictEqual({ x: 0 });
    });
});
