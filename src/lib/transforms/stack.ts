import isDataRecord from '$lib/helpers/isDataRecord.js';
import { resolveChannel } from '$lib/helpers/resolve.js';
import type {
    ChannelAccessor,
    ScaledChannelName,
    DataRow,
    DataRecord,
    TransformArg,
    ChannelName
} from '$lib/types.js';
import {
    stack,
    stackOffsetExpand,
    stackOffsetSilhouette,
    stackOffsetWiggle,
    stackOrderAppearance,
    stackOrderAscending,
    stackOrderInsideOut,
    stackOrderNone,
    stackOffsetDiverging
} from 'd3-shape';
import { index, union, groups as d3Groups } from 'd3-array';

const DEFAULT_STACK_OPTIONS: StackOptions = {
    order: null,
    offset: null,
    reverse: false
};

export type StackOrder = 'none' | 'appearance' | 'inside-out' | 'sum';
export type StackOffset = 'none' | 'wiggle' | 'center' | 'normalize' | 'diverging';

export type StackOptions = {
    offset: null | StackOffset;
    order: null | StackOrder;
    reverse: boolean;
};

const STACK_ORDER: Record<StackOrder, Function> = {
    // null
    // TODO: value: ,
    none: stackOrderNone,
    sum: stackOrderAscending,
    appearance: stackOrderAppearance,
    'inside-out': stackOrderInsideOut
};

const STACK_OFFSET: Record<StackOffset, Function | null> = {
    none: null,
    diverging: stackOffsetDiverging,
    wiggle: stackOffsetWiggle,
    center: stackOffsetSilhouette,
    normalize: stackOffsetExpand
};

function stackXY(
    byDim: 'x' | 'y',
    data: DataRow[],
    channels: Partial<Record<ScaledChannelName, ChannelAccessor>>,
    options: StackOptions
) {
    // we need to stack the data for each facet separately
    const groupFacetsBy = [
        channels.fx != null ? 'fx' : null,
        channels.fy != null ? 'fy' : null
    ].filter((d) => d !== null) as ChannelName[];

    const groupBy = channels.z ? 'z' : channels.fill ? 'fill' : channels.stroke ? 'stroke' : true;
    const secondDim =
        byDim === 'x' ? (channels.y1 != null ? 'y1' : 'y') : channels.x1 != null ? 'x1' : 'x';

    const byLow: 'x1' | 'y1' = `${byDim}1`;
    const byHigh: 'x2' | 'y2' = `${byDim}2`;

    if (
        channels[byDim] != null &&
        channels[`${byLow}`] === undefined &&
        channels[`${byHigh}`] === undefined
    ) {
        // resolve all channels for easier computation below
        const resolvedData = data.map((d) => ({
            ...(isDataRecord(d) ? d : { __orig: d }),
            [`__${secondDim}`]: resolveChannel(secondDim, d, channels),
            __group: groupBy === true ? 'G' : resolveChannel(groupBy, d, channels),
            __facet:
                groupFacetsBy.length > 0
                    ? groupFacetsBy
                        .map((channel) => String(resolveChannel(channel, d, channels)))
                        .join('---')
                    : 'F',
            [`__${byDim}`]: resolveChannel(byDim, d, channels)
        })) as DataRecord[];

        // the final data ends up here
        const out = [];

        // first we group the dataset by facets to avoid stacking of rows that are
        // in separate panels
        const groups = d3Groups(resolvedData, (d) => d.__facet);
        for (const [, facetData] of groups) {
            // now we index the data on the second dimension, e.g. over x
            // when stacking over y
            const indexed = index(
                facetData,
                (d) => d[`__${secondDim}`],
                (d) => d.__group
            );

            const stackOrder = (series: number[][]) => {
                const f = STACK_ORDER[options.order || 'none'];
                return options.reverse ? f(series).reverse() : f(series);
            };

            // now stack the values for each index
            const series = stack()
                .order(stackOrder)
                .offset(STACK_OFFSET[options.offset])
                .keys(union(facetData.map((d) => d.__group) as string[]))
                .value(([, group], key) => (group.get(key) ? group.get(key)[`__${byDim}`] : 0))(
                    indexed
                );

            // and combine it all back into a flat array
            const newData = series
                .map((values) => {
                    const groupKey = values.key;
                    return values
                        .filter((d) => d.data[1].get(groupKey))
                        .map((d) => {
                            const datum = d.data[1].get(groupKey);
                            // cleanup our internal keys
                            delete datum.__group;
                            delete datum.__facet;
                            return { ...datum, [`__${byLow}`]: d[0], [`__${byHigh}`]: d[1] };
                        });
                })
                .flat(1);

            // which we then add to the output data
            out.push(newData);
        }

        return {
            data: out.flat(1),
            ...channels,
            [byDim]: undefined,
            ...(typeof channels[byDim] === 'string' && !channels[`__${byDim}_origField`]
                ? { [`__${byDim}_origField`]: channels[byDim] }
                : {}),
            ...{ [byLow]: `__${byLow}`, [byHigh]: `__${byHigh}` }
        };
    }
    return { data, ...channels };
}

export function stackY<T>({ data, ...channels }: T, opts: Partial<StackOptions> = {}): T {
    return stackXY('y', data, channels, applyDefaults(opts));
}

export function stackX(
    { data, ...channels }: TransformArg,
    opts: Partial<StackOptions> = {}
): TransformArg {
    return stackXY('x', data, channels, applyDefaults(opts));
}

function applyDefaults(opts: Partial<StackOptions>): StackOptions {
    if (opts.offset === 'wiggle' && opts.order === undefined) {
        return { ...DEFAULT_STACK_OPTIONS, order: 'inside-out', ...opts };
    }
    return { ...DEFAULT_STACK_OPTIONS, ...opts };
}
