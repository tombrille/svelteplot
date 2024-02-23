import { isValid } from '$lib/helpers/index.js';
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord, RawValue, ScaledChannelName, TransformArg } from '$lib/types.js';
import {
    min,
    max,
    mode,
    sum,
    mean,
    median,
    variance,
    deviation,
    quantile,
    groups as d3Groups,
} from 'd3-array';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// For internal use.
export type ReducerPercentile =
    | (`p${Digit}${Digit}` & Record<never, never>) // see https://github.com/microsoft/TypeScript/issues/29729
    | 'p25'
    | 'p50'
    | 'p75';

type WindowOptions = {
    k: number;
    anchor: 'start' | 'middle' | 'end';
    reduce:
        | 'mean'
        | 'median'
        | 'min'
        | 'max'
        | 'mode'
        | 'sum'
        | 'deviation'
        | 'variance'
        | 'difference'
        | 'ratio'
        | 'first'
        | 'last'
        | ReducerPercentile;
    strict: boolean;
};

const Reducer: Record<WindowOptions['reduce'], (d: Iterable<number | null | undefined>) => number> =
    {
        min,
        max,
        mode,
        sum,
        mode,
        mean,
        median,
        variance,
        deviation,
        first: (d: number[]) => d[0],
        last: (d: number[]) => d.at(-1),
        difference: (d: number[]) => d.at(-1) - d[0],
        ratio: (d: number[]) => d.at(-1) / d[0]
    };

export function windowX(args: TransformArg<DataRecord>, options: WindowOptions) {
    return windowDim('x', args, options);
}
export function windowY(args: TransformArg<DataRecord>, options: WindowOptions) {
    return windowDim('y', args, options);
}

function windowDim(
    dim: 'x' | 'y',
    { data, ...channels }: TransformArg<DataRecord>,
    options: WindowOptions
) {
    const { anchor = 'middle', reduce = 'mean', strict = false } = options;
    let { k } = options;
    // we only change the data, but not the
    if (!((k = Math.floor(k)) > 0)) throw new Error(`invalid k: ${k}`);

    const reduceFn =
        typeof reduce === 'function'
            ? reduce
            : (reduce as string).startsWith('p')
              ? percentile(reduce)
              : Reducer[reduce];

    // group by z, fill or stroke
    const groupBy =
        channels.z != null
            ? 'z'
            : channels.fill != null
              ? 'fill'
              : channels.stroke != null
                ? 'stroke'
                : false;
    const groups = groupBy
        ? d3Groups(data, (d) => resolveChannel(groupBy, d, channels)).map(([, v]) => v)
        : [data];

    const out = [];
    const reduceChannels = [dim, `${dim}1`, `${dim}2`].filter(d => channels[d] != null) as ScaledChannelName[];
    const shift = anchor === 'start' ? 0 : anchor === 'end' ? k - 1 : (k - 1) >> 1;
    for (const values of groups) {
        // resolve all "x" values
        const X = values.map((d) => Object.fromEntries(reduceChannels.map(channel => [channel, resolveChannel(channel, d, channels)])) );
        const L = values.length;
        for (let i = 0; i < L; i++) {
            const s0 = Math.max(0, i - shift);
            const newDatum = { ...values[i] };
            for (const channel of reduceChannels) {
                const window = X.slice(s0, Math.min(L, i - shift + k)).map(d => d[channel]).filter(isValid);
                const reduced = strict && window.length !== k ? null : reduceFn(window);
                newDatum[`__reduced_${channel}__`] = reduced;
            }
            out.push(newDatum);
        }
    }
    //
    // return
    return { data: out, ...channels, ...(Object.fromEntries(reduceChannels.map(channel => [channel, `__reduced_${channel}__`]))) };
}

function percentile(reduce) {
    const p = +`${reduce}`.slice(1) / 100;
    return (I, f) => quantile(I, p, f);
}
