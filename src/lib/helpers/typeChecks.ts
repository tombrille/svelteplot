import type { RawValue } from '$lib/types';
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
