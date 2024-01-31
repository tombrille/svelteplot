/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */

import type { RawValue } from '$lib/types.js';
import { isDate, isFinite } from 'underscore';
import { isSymbol } from './symbols.js';
import { color } from 'd3-color';

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
    return v == null || ((typeof v === 'string' || typeof v === 'function') && isSymbol(v));
}

const CSS_VAR = /^var\(--([a-z-0-9,\s]+)\)$/;

export function isColorOrNull(v: RawValue) {
    return (
        v == null ||
        (typeof v === 'string' && (v === 'currentColor' || CSS_VAR.test(v) || color(v) !== null))
    );
}

export function isOpacityOrNull(v: RawValue) {
    return v == null || (typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1);
}
