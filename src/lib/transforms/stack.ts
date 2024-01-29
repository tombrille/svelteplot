import isDataRecord from '$lib/helpers/isDataRecord.js';
import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';
import type {
    BaseMarkStyleProps,
    ChannelAccessor,
    ScaledChannelName,
    DataRow,
    DataRecord,
    TransformArg
} from '$lib/types.js';
import {
    stack,
    stackOffsetExpand,
    stackOffsetSilhouette,
    stackOffsetWiggle,
    stackOrderAppearance,
    stackOrderAscending,
    stackOrderInsideOut,
    stackOrderNone
} from 'd3-shape';
import { index, union } from 'd3-array';

type MarkX = BaseMarkStyleProps & {
    z?: ChannelAccessor;
    x?: ChannelAccessor;
    x1?: ChannelAccessor;
    x2?: ChannelAccessor;
    y?: ChannelAccessor;
};

type MarkY = BaseMarkStyleProps & {
    z?: ChannelAccessor;
    y?: ChannelAccessor;
    y1?: ChannelAccessor;
    y2?: ChannelAccessor;
    x?: ChannelAccessor;
};

const DEFAULT_STACK_OPTIONS: StackOptions = {
    order: null,
    offset: null,
    reverse: false
};

type StackOrder = 'none' | 'appearance' | 'inside-out' | 'sum';
type StackOffset = 'none' | 'wiggle' | 'center' | 'normalize';

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
    const groupBy = channels.z ? 'z' : channels.fill ? 'fill' : channels.stroke ? 'stroke' : true;

    const secondDim = byDim === 'x' ? 'y' : 'x';

    const byLow: 'x1' | 'y1' = `${byDim}1`;
    const byHigh: 'x2' | 'y2' = `${byDim}2`;

    if (
        channels[byDim] !== undefined &&
        channels[`${byLow}`] === undefined &&
        channels[`${byHigh}`] === undefined
    ) {
        const resolvedData = data.map((d) => ({
            ...(isDataRecord(d) ? d : { __orig: d }),
            [`__${secondDim}`]: resolveChannel(secondDim, d, channels),
            __group: groupBy === true ? 'G' : resolveChannel(groupBy, d, channels),
            [`__${byDim}`]: resolveChannel(byDim, d, channels)
        })) as DataRecord[];

        const indexed = index(
            resolvedData,
            (d) => d[`__${secondDim}`],
            (d) => d.__group
        );

        const stackOrder = (series: number[][]) => {
            const f = STACK_ORDER[options.order || 'none'];
            return options.reverse ? f(series).reverse() : f(series);
        };

        const series = stack()
            .order(stackOrder)
            .offset(STACK_OFFSET[options.offset])
            .keys(union(resolvedData.map((d) => d.__group) as string[]))
            .value(([, group], key) => (group.get(key) ? group.get(key)[`__${byDim}`] : 0))(
            indexed
        );

        const newData = series
            .map((values) => {
                const groupKey = values.key;
                return values
                    .filter((d) => d.data[1].get(groupKey))
                    .map((d) => {
                        const {
                            [`__${byDim}`]: unused1,
                            [`__${secondDim}`]: unused2,
                            ...datum
                        } = d.data[1].get(groupKey);
                        return { ...datum, [`__${byLow}`]: d[0], [`__${byHigh}`]: d[1] };
                    });
            })
            .flat(1);
        return {
            data: newData,
            ...channels,
            [byDim]: undefined,
            ...(typeof channels[byDim] === 'string'
                ? { [`__${byDim}_stackOrigField`]: channels[byDim] }
                : {}),
            ...{ [byLow]: `__${byLow}`, [byHigh]: `__${byHigh}` }
        };
    }
    return { data, ...channels };
}

export function stackY(
    { data, ...channels }: TransformArg,
    opts: Partial<StackOptions> = {}
): TransformArg {
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
