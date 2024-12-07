import { describe, it, expect } from 'vitest';
import { binX, type BinXOptions } from './bin.js';
import { range } from 'd3-array';

describe('binX', () => {
    const input = {
        data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
            { x: 3, y: 30 },
            { x: 4, y: 40 },
            { x: 5, y: 50 }
        ],
        x: 'x'
    };

    it('bins the x channel with default options', () => {
        const options: BinXOptions = {
            thresholds: 'auto',
            y: 'count',
            cumulative: false
        };

        const expectedOutput = {
            data: [
                { __x1: 0, __x: 1, __x2: 2, __y: 1 },
                { __x1: 2, __x: 3, __x2: 4, __y: 2 },
                { __x1: 4, __x: 5, __x2: 6, __y: 2 }
            ],
            __x_origField: 'x',
            __y_origField: 'Frequency',
            x: '__x',
            x1: '__x1',
            x2: '__x2',
            y: '__y',
            insetLeft: 0.5,
            insetRight: 0.5
        };

        const result = binX(input, options);
        expect(result).toEqual(expectedOutput);
    });

    it('bins the x channel with custom options', () => {
        const options: BinXOptions = {
            thresholds: 'auto',
            y: 'count',
            cumulative: true
        };

        const expectedOutput = {
            data: [
                { __x1: 0, __x: 1, __x2: 2, __y: 1 },
                { __x1: 2, __x: 3, __x2: 4, __y: 3 },
                { __x1: 4, __x: 5, __x2: 6, __y: 5 }
            ],
            __x_origField: 'x',
            __y_origField: 'Frequency',
            x: '__x',
            x1: '__x1',
            x2: '__x2',
            y: '__y',
            insetLeft: 0.5,
            insetRight: 0.5
        };

        const result = binX(input, options);
        expect(result).toEqual(expectedOutput);
    });

    const dailyData = range(31).map((d) => ({
        x: new Date(`2020-01-${d + 1}`),
        y: d
    }));

    it('bins dailys into weekly data', () => {
        const { data, ...channels } = binX(
            {
                data: dailyData,
                x: 'x',
                y: 'y'
            },
            {
                interval: 'week',
                y: 'mean'
            }
        );
        expect(channels).toEqual({
            insetLeft: 0.5,
            insetRight: 0.5,
            x: '__x',
            y: '__y',
            x1: '__x1',
            x2: '__x2',
            __x_origField: 'x',
            __y_origField: 'Average ( y )'
        });
        expect(data).toHaveLength(5);
        expect(data[0]).toEqual({
            __x1: new Date('2019-12-31T23:00:00.000Z'),
            __x2: new Date('2020-01-04T23:00:00.000Z'),
            __x: new Date('2020-01-02T23:00:00.000Z'),
            __y: 1.5
        });
    });

    // it.only('bins dailys into weekly data', () => {
    //     const { data, ...channels } = binX(
    //         {
    //             data: dailyData,
    //             x: 'x',
    //             y1: 'y',
    //             y2: 'y'
    //         },
    //         {
    //             interval: 'week',
    //             y1: 'min',
    //             y2: 'max'
    //         }
    //     );
    //     console.log({ data, channels });
    //     expect(channels).toEqual({
    //         insetLeft: 0.5,
    //         insetRight: 0.5,
    //         x: '__x',
    //         y: '__y',
    //         x1: '__x1',
    //         x2: '__x2',
    //         __x_origField: 'x',
    //         __y_origField: 'Average ( y )'
    //     });
    //     expect(data).toHaveLength(5);
    //     expect(data[0]).toEqual({
    //         __x1: new Date('2019-12-31T23:00:00.000Z'),
    //         __x2: new Date('2020-01-04T23:00:00.000Z'),
    //         __x: new Date('2020-01-02T23:00:00.000Z'),
    //         __y: 1.5
    //     });
    // });
});
