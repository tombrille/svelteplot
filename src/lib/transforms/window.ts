import { isValid } from '$lib/helpers/index.js';
import { Reducer, mayberReducer, type ReducerName } from '$lib/helpers/reduce.js';
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord, ScaledChannelName, TransformArg } from '$lib/types.js';
import { groups as d3Groups } from 'd3-array';

type WindowOptions = {
    k: number;
    anchor: 'start' | 'middle' | 'end';
    reduce: ReducerName;
    strict: boolean;
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

    const reduceFn = mayberReducer(reduce);

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
    const reduceChannels = [dim, `${dim}1`, `${dim}2`].filter(
        (d) => channels[d] != null
    ) as ScaledChannelName[];
    const shift = anchor === 'start' ? 0 : anchor === 'end' ? k - 1 : (k - 1) >> 1;
    for (const values of groups) {
        // resolve all "x" values
        const X = values.map((d) =>
            Object.fromEntries(
                reduceChannels.map((channel) => [channel, resolveChannel(channel, d, channels)])
            )
        );
        const L = values.length;
        for (let i = 0; i < L; i++) {
            const s0 = Math.max(0, i - shift);
            const newDatum = { ...values[i] };
            for (const channel of reduceChannels) {
                const window = X.slice(s0, Math.min(L, i - shift + k))
                    .map((d) => d[channel])
                    .filter(isValid);
                const reduced = strict && window.length !== k ? null : reduceFn(window);
                newDatum[`__reduced_${channel}__`] = reduced;
            }
            out.push(newDatum);
        }
    }
    //
    // return
    return {
        data: out,
        ...channels,
        ...Object.fromEntries(reduceChannels.map((channel) => [channel, `__reduced_${channel}__`]))
    };
}
