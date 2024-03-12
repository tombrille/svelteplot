import { describe, it, expect } from 'vitest';
import { binX, type BinXOptions } from './bin.js';

describe('binX', () => {
    const input = {
        data: [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 40 }, { x: 5, y: 50 }],
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
            '__x_origField': "x",
            '__y_origField': "COUNT",
            x: '__x',
            x1: '__x1',
            x2: '__x2',
            y: '__y',
            insetLeft: 0.5,
            insetRight: 0.5,
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
            '__x_origField': "x",
            '__y_origField': "COUNT",
            x: '__x',
            x1: '__x1',
            x2: '__x2',
            y: '__y',
            insetLeft: 0.5,
            insetRight: 0.5,
        };
        
        const result = binX(input, options);
        expect(result).toEqual(expectedOutput);
    });
});