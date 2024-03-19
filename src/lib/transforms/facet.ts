import type { DataRecord, TransformArg } from '$lib/types.js';

/**
 * takes an fz channel and a column count as input and creates
 * fx and fy channels to wrap the facets
 */
export function facetWrap({ data, ...channels }: TransformArg<DataRecord>): TransformArg<DataRecord> {
    if (channels.fz) {
        return { data, ...channels, fx: channels.fz, fy: channels.fz };
    }
    return { data, ...channels };
}
