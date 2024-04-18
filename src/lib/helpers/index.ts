import type { BaseMarkProps, ChannelName, DataRecord, RawValue } from '$lib/types.js';
import type { Snippet } from 'svelte';
import { resolveProp } from './resolve.js';
import isDate from 'underscore/modules/isDate.js';

/**
 * Returns first argument that is not null or undefined
 */
export function coalesce(...args: (RawValue | undefined | null)[]) {
    for (const arg of args) {
        if (arg !== null && arg !== undefined) {
            return arg;
        }
    }
    return null; // Return null if all arguments are null or undefined
}

export function testFilter(datum: DataRecord, options: Partial<BaseMarkProps>) {
    return options.filter == null || resolveProp(options.filter, datum);
}

export function randomId() {
    return Math.ceil(1e9 + Math.random() * 1e9).toString(36);
}

export function isSnippet(object: unknown): object is Snippet {
    return !!object && object[Symbol.for('svelte.snippet')] === true;
}

export function isValid(value: RawValue): value is number | Date | string {
    return value !== null && value !== undefined && !Number.isNaN(value);
}

export function maybeData(data: DataRecord[]): DataRecord[] {
    // if (data.type === 'FeatureCollection') return data.features;
    return data;
}

export function isObject(option: object | RawValue): option is object {
    // doesn't work with Proxies
    return (
        typeof option === 'object' && !isDate(option) && !Array.isArray(option) && option !== null
    );
}

export function maybeNumber(value: RawValue | null): number | null {
    return value != null ? +value : null;
}

export const constant =
    <T>(x: T) =>
    () =>
        x;

export const POSITION_CHANNELS: Set<ChannelName> = new Set(['x', 'x1', 'x2', 'y', 'y1', 'y2']);