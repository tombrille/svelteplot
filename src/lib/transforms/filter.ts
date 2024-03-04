import { testFilter } from '$lib/helpers/index.js';
import type { DataRecord, TransformArg } from '$lib/types.js';

export function filter({ data, ...channels }: TransformArg<DataRecord>): TransformArg<DataRecord> {
    return {
        data: data.filter((d) => testFilter(d, channels)),
        ...channels,
        filter: null
    };
}
