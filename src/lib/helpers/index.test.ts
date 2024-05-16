import { coalesce, isObject, pick, omit } from './index';
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

describe('pick', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    it('should return a new object with the specified keys', () => {
        expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 });
        expect(pick(obj, 'b', 'd')).toEqual({ b: 2, d: 4 });
    });

    it('should not include keys that are not present in the input object', () => {
        expect(pick(obj, 'a', 'b', 'e')).toEqual({ a: 1, b: 2 });
        expect(pick(obj, 'e', 'f')).toEqual({});
    });
});

describe('omit', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };

    it('should return a new object with the specified keys', () => {
        expect(omit(obj, 'a', 'c')).toEqual({ b: 2, d: 4 });
        expect(omit(obj, 'b', 'd')).toEqual({ a: 1, c: 3 });
    });

    it('should not include keys that are not present in the input object', () => {
        expect(omit(obj, 'a', 'b', 'e')).toEqual({ c: 3, d: 4 });
        expect(omit(obj, 'e', 'f')).toEqual(obj);
    });
});