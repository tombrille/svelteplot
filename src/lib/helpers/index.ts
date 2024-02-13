import type { BaseMarkProps, DataRecord } from '$lib/types.js';
import { resolveProp } from './resolve.js';
import { csvParse, autoType } from 'd3-dsv';

export function coalesce(a: number | undefined | null, b: number | null) {
    return a == null ? Number(b) : a;
}

export function testFilter(datum: DataRecord, options: Partial<BaseMarkProps>) {
    return options.filter == null || resolveProp(options.filter, datum);
}

export function randomId() {
    return Math.ceil(1e9 + Math.random() * 1e9).toString(36);
}

async function loadCSV(fetch, dataset: string) {
    const res = await fetch(`/data/${dataset}.csv`);
    const text = await res.text();
    return csvParse(text, autoType);
}

/**
 * helper function used in the SveltePlot docs to load example datasets
 */
export async function loadDatasets(ids: string[], fetch) {
    return Object.fromEntries(
        (await Promise.all(ids.map((id) => loadCSV(fetch, id)))).map((data, i) => [ids[i], data])
    );
}
