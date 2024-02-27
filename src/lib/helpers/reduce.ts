import type { ChannelAccessor, ChannelName, DataRecord, DataRow, RawValue } from '$lib/types.js';
import { min, max, mode, sum, mean, median, variance, deviation, quantile, range } from 'd3-array';
import { resolveChannel } from './resolve.js';

type ReducerFunc = (group: DataRow[]) => RawValue;
type ReducerOption = ReducerName | ReducerFunc;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// For internal use.
export type ReducerPercentile =
    | (`p${Digit}${Digit}` & Record<never, never>) // see https://github.com/microsoft/TypeScript/issues/29729
    | 'p25'
    | 'p50'
    | 'p75';

export type ReducerName =
    | 'count'
    | 'deviation'
    | 'difference'
    | 'first'
    | 'last'
    | 'max'
    | 'mean'
    | 'median'
    | 'min'
    | 'mode'
    | 'ratio'
    | 'sum'
    | 'variance'
    | ReducerPercentile;

const StaticReducer: Record<ReducerName, (d: Iterable<number | null | undefined>) => number> = {
    count: (d) => d.length,
    min,
    max,
    mode,
    sum,
    mode,
    mean,
    median,
    identity: (d) => d,
    variance,
    deviation,
    first: (d: number[]) => d[0],
    last: (d: number[]) => d.at(-1),
    difference: (d: number[]) => d.at(-1) - d[0],
    ratio: (d: number[]) => d.at(-1) / d[0]
    // TODO: proportion
    // TODO: proportion-facet
    // TODO: min-index
    // TODO: max-index
};

export const Reducer = new Proxy(StaticReducer, {
    get(target, prop) {
        if (String(prop).charAt(0) === 'p' && String(prop).length === 3) {
            const p = +String(prop).slice(1) / 100;
            return percentile(p);
        }
        // eslint-disable-next-line prefer-rest-params
        return Reflect.get(...arguments);
    }
});

function percentile(p) {
    return (I, f) => quantile(I, p, f);
}

export function mayberReducer(r: ReducerOption): ReducerFunc {
    if (typeof r === 'string' && typeof Reducer[r] === 'function') {
        return Reducer[r];
    } else if (typeof r === 'function') return r;
    throw new Error('unknown reducer ' + r);
}

export function reduceOutputs(
    newDatum: DataRecord,
    data: DataRecord[],
    options: Record<ChannelName, ReducerOption>,
    outputs: Iterable<ChannelName>,
    channels: Record<ChannelName, ChannelAccessor>,
    newChannels: Record<ChannelName, ChannelAccessor>
) {
    for (const k of outputs) {
        if (options[k] != null) {
            const values =
                channels[k] == null ? data : data.map((d) => resolveChannel(k, d, channels));
            const reducer = mayberReducer(options[k]);

            newDatum[`__${k}`] = reducer(values);
            newChannels[k] = `__${k}`;

            if (typeof options[k] === 'string') {
                // we have a named reducer like 'count', so let's try to preserve the
                // source channel mapping for axis labels
                if (typeof channels[k] === 'string') {
                    // the named reducer is applied to a column name, so we can use a combination
                    // of both as axis labels, e.g. MEAN(weight)
                    // eslint-disable-next-line no-irregular-whitespace
                    newChannels[`__${k}_origField`] =
                        `${String(reducer).toUpperCase()} ( ${channels[k]} )`;
                } else {
                    newChannels[`__${k}_origField`] = options[k];
                }
            }
        }
    }
}
