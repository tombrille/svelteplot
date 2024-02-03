import { describe, it, expect } from 'vitest';
import { inferScaleType } from './scales.js';

const STRINGS = ['foo', 'bar', 'baz'];
const DATES = [new Date(), new Date()];
const NUMBERS = [1, 2, 3, 4];

describe('inferScaleType', () => {
    it('infers band for strings', () => {
        expect(inferScaleType('x', STRINGS, new Set())).toBe('band');
    });
    it('infers linear for numbers', () => {
        expect(inferScaleType('x', NUMBERS, new Set())).toBe('linear');
    });
    it('infers sqrt for radius axis', () => {
        expect(inferScaleType('r', NUMBERS, new Set())).toBe('sqrt');
    });
    it('correctly infers time scale', () => {
        expect(inferScaleType('x', DATES, new Set())).toBe('time');
    });
    it('enforces ordinal scale for symbol axis', () => {
        expect(inferScaleType('symbol', STRINGS, new Set())).toBe('ordinal');
        expect(inferScaleType('symbol', DATES, new Set())).toBe('ordinal');
        expect(inferScaleType('symbol', NUMBERS, new Set())).toBe('ordinal');
    });
    it('enforces band scales for bars and ticks', () => {
        expect(inferScaleType('x', NUMBERS, new Set(['barY']))).toBe('band');
        expect(inferScaleType('x', NUMBERS, new Set(['tickY']))).toBe('band');
        expect(inferScaleType('y', NUMBERS, new Set(['barX']))).toBe('band');
        expect(inferScaleType('y', NUMBERS, new Set(['tickX']))).toBe('band');
    });
    it('infers point scale if just one value', () => {
        expect(inferScaleType('x', [1], new Set())).toBe('point');
        expect(inferScaleType('x', ['x'], new Set())).toBe('point');
        expect(inferScaleType('x', [new Date()], new Set())).toBe('point');
    });
});
