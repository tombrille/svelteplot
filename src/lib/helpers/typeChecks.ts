import type { RawValue } from '$lib/types.js';
import chroma from 'chroma-js';
import { isDate, isFinite } from 'underscore';

export function isBooleanOrNull(v: RawValue) {
    return v == null || typeof v === 'boolean';
}

export function isDateOrNull(v: RawValue) {
    return v == null || isDate(v);
}

export function isNumberOrNull(v: RawValue) {
    return v == null || isFinite(v);
}

export function isStringOrNull(v: RawValue) {
    return v == null || typeof v === 'string';
}

export function isColorOrNull(v: RawValue) {
    console.log({v}, chroma.valid(v))
    // todo: maybe not use chroma.js here to save kb
    return v == null || (typeof v === 'string' && (chroma.valid(v) || v === 'currentColor'));
}

export function isOpacityOrNull(v: RawValue) {
    return v == null || (typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1);
}
