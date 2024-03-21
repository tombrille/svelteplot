import { coalesce, isObject } from './index';
import { describe, it, expect } from 'vitest';

describe('coalesce', () => {
    it('should return the first non-null and non-undefined argument', () => {
        expect(coalesce(null, {}, 'value')).toEqual({});
        expect(coalesce(null, 0, 'value')).toBe(0);
        expect(coalesce(null, undefined, 'value')).toBe('value');
        expect(coalesce(undefined, 'value', null)).toBe('value');
        expect(coalesce('value', null, undefined)).toBe('value');
        expect(coalesce(null, undefined, null)).toBeNull();
        expect(coalesce(undefined, null, undefined)).toBeNull();
    });

    it('should return undefined if all arguments are null or undefined', () => {
        expect(coalesce(null, undefined, null)).toBeNull();
        expect(coalesce(undefined, null, undefined)).toBeNull();
        expect(coalesce(null, null, null)).toBeNull();
        expect(coalesce(undefined, undefined, undefined)).toBeNull();
    });
});

describe('isObject', () => {
    it('should return true if the input is an object', () => {
        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(false);
        expect(isObject(new Date())).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(123)).toBe(false);
        expect(isObject('string')).toBe(false);
        expect(isObject(true)).toBe(false);
    });
});
