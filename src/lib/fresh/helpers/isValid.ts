import type { RawValue } from '../types.js';

export function isValid(value: RawValue): value is number | Date | string {
    return value !== null && !Number.isNaN(value);
}
