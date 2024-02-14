import isDataRecord from '$lib/helpers/isDataRecord.js';
import { resolveChannel, toChannelOption } from '$lib/helpers/resolve.js';
import type { DataRecord, DataRow, TransformArg } from '$lib/types.js';
import { shuffler } from 'd3-array';
import { randomLcg } from 'd3-random';

export function sort(
    { data, ...channels }: TransformArg<DataRecord>,
    options: { reverse?: boolean } = {}
) {
    if (channels.sort) {
        const { sort } = channels;
        if (isDataRecord(sort) && sort.channel && sort.channel.charAt(0) === '-') {
            sort.channel = sort.channel.substr(1);
            sort.order = 'descending';
        }
        // sort data
        return {
            data: data
                .map((d) => ({ ...d, __sortkey: resolveChannel('sort', d, { ...channels, sort }) }))
                .toSorted(
                    (a, b) =>
                        (a.__sortkey > b.__sortkey ? 1 : a.__sortkey < b.__sortkey ? -1 : 0) *
                        (options.reverse || sort?.order === 'descending' ? -1 : 1)
                ),
                // .map(({ __sortkey, ...d }) => d),
            ...channels
        };
    }
    return { data, ...channels };
}

/**
 * reverses the data row order
 */
export function shuffle(
    { data, ...channels }: TransformArg<DataRow[]>,
    options: { seed?: number } = {}
) {
    const random = randomLcg(options.seed);
    const shuffle = shuffler(random);
    return {
        data: shuffle(data.slice(0)),
        ...channels
    };
}

/**
 * reverses the data row order
 */
export function reverse({ data, ...channels }: TransformArg<DataRow[]>) {
    return {
        data: data.toReversed(),
        ...channels
    };
}
