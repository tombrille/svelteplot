import type { BaseMarkProps, DataRecord } from '$lib/types.js';
import { resolveProp } from './resolve.js';

export function coalesce(a: number | undefined | null, b: number | null) {
    return a == null ? Number(b) : a;
}

export function testFilter(datum: DataRecord, options: Partial<BaseMarkProps>) {
    return options.filter == null || resolveProp(options.filter, datum);
}
