import { describe, it, expect, vi } from 'vitest';
import { intervalX, intervalY } from './interval.js';

describe('intervalX', () => {
    it('should calculate x1 and x2 based on interval', () => {
        const data = [{ x: 5 }, { x: 15 }];
        const options = { interval: 10, x: 'x' };
        const plot = { scales: { x: { type: 'linear' } } };

        const result = intervalX({ data, ...options }, { plot });

        expect(result.data).toEqual([
            { x: 5, __x1: 0, __x2: 10 },
            { x: 15, __x1: 10, __x2: 20 }
        ]);
        expect(result.x1).toBe('__x1');
        expect(result.x2).toBe('__x2');
    });

    it('should handle time-based intervals (e.g., days)', () => {
        const data = [
            { x: new Date('2025-04-15T05:00:00Z') },
            { x: new Date('2025-04-16T12:00:00Z') },
            { x: new Date('2025-04-16T18:00:00Z') },
            { x: new Date('2025-04-16T23:00:00Z') },
            { x: new Date('2025-04-17T02:00:00Z') },
            { x: new Date('2025-04-17T10:00:00Z') },
            { x: new Date('2025-04-17T12:00:00Z') }
        ];
        const options = { interval: '1 day', x: 'x', type: 'time' }; // 1 day in milliseconds
        const plot = { scales: { x: { type: 'time' } } };

        const result = intervalX({ data, ...options }, { plot });

        expect(result.data).toEqual([
            {
                x: new Date('2025-04-15T05:00:00Z'),
                __x1: new Date('2025-04-14T22:00:00Z'),
                __x2: new Date('2025-04-15T22:00:00Z')
            },
            {
                x: new Date('2025-04-16T12:00:00Z'),
                __x1: new Date('2025-04-15T22:00:00Z'),
                __x2: new Date('2025-04-16T22:00:00Z')
            },
            {
                x: new Date('2025-04-16T18:00:00Z'),
                __x1: new Date('2025-04-15T22:00:00Z'),
                __x2: new Date('2025-04-16T22:00:00Z')
            },
            {
                x: new Date('2025-04-16T23:00:00Z'),
                __x1: new Date('2025-04-16T22:00:00Z'),
                __x2: new Date('2025-04-17T22:00:00Z')
            },
            {
                x: new Date('2025-04-17T02:00:00Z'),
                __x1: new Date('2025-04-16T22:00:00Z'),
                __x2: new Date('2025-04-17T22:00:00Z')
            },
            {
                x: new Date('2025-04-17T10:00:00Z'),
                __x1: new Date('2025-04-16T22:00:00Z'),
                __x2: new Date('2025-04-17T22:00:00Z')
            },
            {
                x: new Date('2025-04-17T12:00:00Z'),
                __x1: new Date('2025-04-16T22:00:00Z'),
                __x2: new Date('2025-04-17T22:00:00Z')
            }
        ]);
        expect(result.x1).toBe('__x1');
        expect(result.x2).toBe('__x2');
    });
});

describe('intervalY', () => {
    it('should calculate y1 and y2 based on interval', () => {
        const data = [{ y: 7 }, { y: 17 }];
        const options = { interval: 10, y: 'y' };
        const plot = { scales: { y: { type: 'linear' } } };

        const result = intervalY({ data, ...options }, { plot });

        expect(result.data).toEqual([
            { y: 7, __y1: 0, __y2: 10 },
            { y: 17, __y1: 10, __y2: 20 }
        ]);
        expect(result.y1).toBe('__y1');
        expect(result.y2).toBe('__y2');
    });

    it('should handle time-based intervals (e.g., days)', () => {
        const data = [
            { y: new Date('2025-04-16T12:00:00Z') },
            { y: new Date('2025-04-17T12:00:00Z') }
        ];
        const options = { interval: '2 days', y: 'y' }; // 1 day in milliseconds
        const plot = { scales: { y: { type: 'time' } } };

        const result = intervalY({ data, ...options }, { plot });

        expect(result.data).toEqual([
            {
                y: new Date('2025-04-16T12:00:00Z'),
                __y1: new Date('2025-04-14T22:00:00Z'),
                __y2: new Date('2025-04-16T22:00:00Z')
            },
            {
                y: new Date('2025-04-17T12:00:00Z'),
                __y1: new Date('2025-04-16T22:00:00Z'),
                __y2: new Date('2025-04-18T22:00:00Z')
            }
        ]);
        expect(result.y1).toBe('__y1');
        expect(result.y2).toBe('__y2');
    });
});
