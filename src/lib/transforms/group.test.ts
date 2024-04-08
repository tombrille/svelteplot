import { describe, it, expect } from 'vitest';
import { groupX, groupY } from './group.js';
import type { DataRecord } from '$lib/types.js';

const inputData: DataRecord[] = [
    { year: 2000, value: 10 },
    { year: 2000, value: 20 },
    { year: 2001, value: 15 },
    { year: 2001, value: 25 },
    { year: 2002, value: 10 },
    { year: 2002, value: 20 },
    { year: 2002, value: 30 }
];

describe('groupX', () => {
    it('groups by x channel', () => {
        const { data, ...channels } = groupX({ data: inputData, x: 'year' });
        expect(data).toHaveLength(3);
        expect(data[0].__x).toBe(2000);
        expect(data[1].__x).toBe(2001);
        expect(data[2].__x).toBe(2002);
        expect(channels).toStrictEqual({ x: '__x' });
    });

    it('groups by x channel and reduces count as y channel', () => {
        const { data, ...channels } = groupX(
            { data: inputData, x: 'year', y1: 'value' },
            { y: 'count', y1: 'sum' }
        );
        expect(data).toHaveLength(3);
        expect(data[0].__x).toBe(2000);
        expect(data[1].__x).toBe(2001);
        expect(data[2].__x).toBe(2002);
        expect(data[0].__y).toBe(2);
        expect(data[1].__y).toBe(2);
        expect(data[2].__y).toBe(3);
        expect(data[0].__y1).toBe(30);
        expect(data[1].__y1).toBe(40);
        expect(data[2].__y1).toBe(60);
        expect(channels).toStrictEqual({
            x: '__x',
            y: '__y',
            y1: '__y1',
            __y_origField: 'Frequency',
            __y1_origField: 'Sum ( value )'
        });
    });
});

describe('groupY', () => {
    it('groups by y channel', () => {
        const { data, ...channels } = groupY({ data: inputData, y: 'year' });
        expect(data).toHaveLength(3);
        expect(data[0].__y).toBe(2000);
        expect(data[1].__y).toBe(2001);
        expect(data[2].__y).toBe(2002);
        expect(channels).toStrictEqual({ y: '__y' });
    });

    it('groups by x channel and reduces count as x channel', () => {
        const { data, ...channels } = groupY(
            { data: inputData, y: 'year', x1: 'value' },
            { x: 'count', x1: 'sum' }
        );
        expect(data).toHaveLength(3);
        expect(data[0].__y).toBe(2000);
        expect(data[1].__y).toBe(2001);
        expect(data[2].__y).toBe(2002);
        expect(data[0].__x).toBe(2);
        expect(data[1].__x).toBe(2);
        expect(data[2].__x).toBe(3);
        expect(data[0].__x1).toBe(30);
        expect(data[1].__x1).toBe(40);
        expect(data[2].__x1).toBe(60);
        expect(channels).toStrictEqual({
            y: '__y',
            x: '__x',
            x1: '__x1',
            __x_origField: 'Frequency',
            __x1_origField: 'Sum ( value )'
        });
    });
});
