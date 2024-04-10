import type { RawValue } from '$lib/types.js';
import isDate from 'underscore/modules/isDate.js';
import isFinite from 'underscore/modules/isFinite.js';
import { isSymbol } from './symbols.js';
import { color } from 'd3-color';
import { CSS_VAR } from '$lib/constants.js';

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

export function isSymbolOrNull(v: RawValue) {
    return v == null || ((typeof v === 'string' || typeof v === 'object') && isSymbol(v));
}

export function isColorOrNull(v: RawValue) {
    return (
        v == null ||
        (typeof v === 'string' && (v === 'currentColor' || CSS_VAR.test(v) || color(v) !== null))
    );
}

export function isOpacityOrNull(v: RawValue) {
    return v == null || (typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1);
}
