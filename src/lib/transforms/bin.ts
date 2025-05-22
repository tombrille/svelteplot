import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord, RawValue } from '$lib/types.js';
import type { TransformArg } from '$lib/types.js';
import { maybeInterval } from '$lib/helpers/autoTicks.js';
import {
    bin as d3Bin,
    extent,
    thresholdFreedmanDiaconis,
    thresholdScott,
    thresholdSturges,
    type ThresholdCountGenerator
} from 'd3-array';
import { reduceOutputs, type ReducerName } from '$lib/helpers/reduce.js';
import { groupFacetsAndZ } from '$lib/helpers/group.js';
import { isDate } from '$lib/helpers/typeChecks.js';

type NamedThresholdsGenerator = 'auto' | 'scott' | 'sturges' | 'freedman-diaconis';

type BinBaseOptions = {
    domain?: [number, number];
    thresholds?: NamedThresholdsGenerator | number | number[] | ThresholdCountGenerator;
    interval?: number | string;
    cumulative?: false | 1 | -1;
    reverse?: boolean;
};

type ReducerOption = ReducerName | ((group: DataRecord[]) => RawValue);

type AdditionalOutputChannels = Partial<{
    fill: ReducerOption;
    stroke: ReducerOption;
    r: ReducerOption;
    opacity: ReducerOption;
    fillOpacity: ReducerOption;
    strokeOpacity: ReducerOption;
}>;

export type BinXOptions = BinBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        y: ReducerOption;
        y1: ReducerOption;
        y2: ReducerOption;
    }>;

export type BinYOptions = BinBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        x: ReducerOption;
        x1: ReducerOption;
        x2: ReducerOption;
    }>;

type BinOptions = BinBaseOptions & AdditionalOutputChannels;

const ThresholdGenerators: { [k in NamedThresholdsGenerator]: ThresholdCountGenerator } = {
    auto: thresholdScott,
    scott: thresholdScott,
    sturges: thresholdSturges,
    'freedman-diaconis': thresholdFreedmanDiaconis
};

function binBy(byDim: 'x' | 'y', { data, ...channels }, options: BinOptions) {
    const { domain, thresholds = 'auto', interval } = options;
    const bin = d3Bin();
    if (domain) bin.domain(domain);
    if (interval) {
        const [lo, hi] = extent(data.map((d) => resolveChannel(byDim, d, channels)));
        bin.thresholds(maybeInterval(interval).range(lo, hi));
    } else if (thresholds)
        bin.thresholds(
            // use a generator
            typeof thresholds === 'string' && ThresholdGenerators[thresholds] !== undefined
                ? ThresholdGenerators[thresholds]
                : thresholds
        );

    // channels.x is the input
    bin.value((d) => resolveChannel(byDim, d, channels));

    // y, y1, y2, fill, stroke, etc are outputs
    const outputs = [
        ...(byDim === 'x' ? ['y', 'y1', 'y2'] : ['x', 'x1', 'x2']),
        'fill',
        'stroke',
        'r',
        'opacity',
        'fillOpacity',
        'strokeOpacity'
    ];

    let newChannels = {
        [byDim === 'x' ? 'insetLeft' : 'insetTop']: 0.5,
        [byDim === 'x' ? 'insetRight' : 'insetBottom']: 0.5,
        ...channels,
        [`${byDim}`]: `__${byDim}`,
        [`${byDim}1`]: `__${byDim}1`,
        [`${byDim}2`]: `__${byDim}2`,
        [`__${byDim}_origField`]: typeof channels[byDim] === 'string' ? channels[byDim] : null
    };

    const newData = [];

    let passedGroups: DataRecord[] = [];

    const bins = bin(data);

    (options.cumulative < 0 ? bins.toReversed() : bins).forEach((group) => {
        const itemBinProps: DataRecord = {
            [`__${byDim}1`]: group.x0,
            [`__${byDim}2`]: group.x1,
            [`__${byDim}`]: isDate(group.x0)
                ? new Date(Math.round((group.x0.getTime() + group.x1.getTime()) * 0.5))
                : (group.x0 + group.x1) * 0.5
        };
        if (options.cumulative) passedGroups = [...passedGroups, ...group];

        const newGroupChannels = groupFacetsAndZ(
            options.cumulative ? passedGroups : group,
            channels,
            (items, itemGroupProps) => {
                const item = { ...itemBinProps, ...itemGroupProps };
                reduceOutputs(item, items, options, outputs, channels, newChannels);
                newData.push(item);
            }
        );

        newChannels = { ...newChannels, ...newGroupChannels };
    });

    return { data: options.reverse ? newData.toReversed() : newData, ...newChannels };
}

/**
 * Bins on x. Also groups on y and the first channel of z, fill, or stroke, if any.
 *
 * @param param0
 * @param options
 */
export function binX<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: BinXOptions = { thresholds: 'auto', cumulative: false }
): TransformArg<T, DataRecord> {
    return binBy('x', { data, ...channels }, options);
}

/**
 * Bins on y. Also groups on y and the first channel of z, fill, or stroke, if any.
 *
 * @param param0
 * @param options
 */
export function binY<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: BinYOptions = { thresholds: 'auto', cumulative: false }
): TransformArg<T, DataRecord> {
    return binBy('y', { data, ...channels }, options);
}

/**
 * for binning in x and y dimension simultaneously
 */
export function bin<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: BinOptions = { thresholds: 'auto', cumulative: false }
): TransformArg<T, DataRecord> {
    const { domain, thresholds = 'auto', interval, cumulative = false } = options;

    const binX = d3Bin();
    const binY = d3Bin();

    if (domain) {
        // this really doesn't make sense...
        binX.domain(domain);
        binY.domain(domain);
    }

    // channels.x is the input
    binX.value((d) => resolveChannel('x', d, channels));
    binY.value((d) => resolveChannel('y', d, channels));

    if (interval) {
        const [xlo, xhi] = extent(data.map((d) => resolveChannel('x', d, channels)));
        const [ylo, yhi] = extent(data.map((d) => resolveChannel('y', d, channels)));
        binX.thresholds(maybeInterval(interval).range(xlo, xhi));
        binY.thresholds(maybeInterval(interval).range(ylo, yhi));
    } else if (thresholds) {
        // when binning in x and y, we need to ensure we are using consistent thresholds
        const t =
            typeof thresholds === 'string' && ThresholdGenerators[thresholds] !== undefined
                ? ThresholdGenerators[thresholds]
                : thresholds;

        binX.thresholds(t);
        binY.thresholds(t);

        const yThresholds = binY(data)
            .slice(1)
            .map((g) => g.x0);
        binY.thresholds(yThresholds);
    }

    // y, y1, y2, fill, stroke, etc are outputs
    const outputs = ['fill', 'stroke', 'r', 'opacity', 'fillOpacity', 'strokeOpacity'];

    let newChannels = {
        inset: 0.5,
        ...channels,
        x: '__x',
        x1: '__x1',
        x2: '__x2',
        y: '__y',
        y1: '__y1',
        y2: '__y2',
        __x_origField: typeof channels.x === 'string' ? channels.x : null,
        __y_origField: typeof channels.y === 'string' ? channels.y : null
    };

    const groupBy = channels.z ? 'z' : channels.fill ? 'fill' : channels.stroke ? 'stroke' : true;
    const groupByPropName =
        groupBy !== true && typeof channels[groupBy] === 'string' ? channels[groupBy] : '__group';

    if (groupBy !== true) newChannels[groupBy] = groupByPropName;

    // consistent intervals

    const newData = [];
    binX(data).forEach((groupX) => {
        const newRecordBaseX = {
            __x1: groupX.x0,
            __x2: groupX.x1,
            __x: isDate(groupX.x0)
                ? new Date(Math.round((groupX.x0.getTime() + groupX.x1.getTime()) * 0.5))
                : (groupX.x0 + groupX.x1) * 0.5
        };

        binY(groupX).forEach((groupY) => {
            const newRecordBaseY = {
                ...newRecordBaseX,
                __y1: groupY.x0,
                __y2: groupY.x1,
                __y: isDate(groupY.x0)
                    ? new Date(Math.round((groupY.x0.getTime() + groupY.x1.getTime()) * 0.5))
                    : (groupY.x0 + groupY.x1) * 0.5
            };

            const newGroupChannels = groupFacetsAndZ(groupY, channels, (items, itemGroupProps) => {
                const newRecord = {
                    ...newRecordBaseY,
                    ...itemGroupProps
                };
                reduceOutputs(newRecord, items, options, outputs, channels, newChannels);
                newData.push(newRecord);
            });

            newChannels = { ...newChannels, ...newGroupChannels };
        });
    });

    return { data: options.reverse ? newData.toReversed() : newData, ...newChannels };
}
