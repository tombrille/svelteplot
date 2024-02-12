/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { ChannelAccessor, DataRecord, RawValue } from '$lib/types.js';
import type { TransformArg } from '$lib/types.js';

import {
    bin as d3Bin,
    groups as d3Groups,
    // bisect,
    // extent,
    thresholdFreedmanDiaconis,
    thresholdScott,
    thresholdSturges,
    // tickIncrement,
    // ticks,
    type ThresholdCountGenerator
} from 'd3-array';

type NamedThresholdsGenerator = 'auto' | 'scott' | 'sturges' | 'freedman-diaconis';

type BinBaseOptions = {
    domain?: [number, number];
    thresholds?: NamedThresholdsGenerator | number | number[] | ThresholdCountGenerator;
    interval?: number | string;
    cumulative?: false | 1 | -1;
    reverse?: boolean;
};

type Reducer = 'count' | 'first' | 'last' | ((group: DataRecord[]) => RawValue);

type AdditionalOutputChannels = Partial<{
    fill: Reducer;
    stroke: Reducer;
    r: Reducer;
    fillOpacity: Reducer;
    strokeOpacity: Reducer;
}>;

type BinXOptions = BinBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        y: Reducer;
        y1: Reducer;
        y2: Reducer;
    }>;

type BinYOptions = BinBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        x: Reducer;
        x1: Reducer;
        x2: Reducer;
    }>;

type BinOptions = BinBaseOptions & AdditionalOutputChannels;

const ThresholdGenerators: { [k in NamedThresholdsGenerator]: ThresholdCountGenerator } = {
    auto: thresholdScott,
    scott: thresholdScott,
    sturges: thresholdSturges,
    'freedman-diaconis': thresholdFreedmanDiaconis
};

const Reducers = {
    count: (group: DataRecord[]) => group.length,
    first: (group: DataRecord[]) => group[0],
    last: (group: DataRecord[]) => group.at(-1)
};

function binBy(byDim: 'x' | 'y', { data, ...channels }, options) {
    const { domain, thresholds = 'auto' } = options;
    const bin = d3Bin();
    if (domain) bin.domain(domain);
    if (thresholds)
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
        'fillOpacity',
        'strokeOpacity'
    ];

    const newChannels = {
        [byDim === 'x' ? 'insetRight' : 'insetBottom']: 1,
        ...channels,
        [`${byDim}`]: `__${byDim}`,
        [`${byDim}1`]: `__${byDim}1`,
        [`${byDim}2`]: `__${byDim}2`,
        [`__${byDim}_origField`]: typeof channels[byDim] === 'string' ? channels[byDim] : null
    };

    const groupBy = channels.z ? 'z' : channels.fill ? 'fill' : channels.stroke ? 'stroke' : true;
    const groupByPropName =
        groupBy !== true && typeof channels[groupBy] === 'string' ? channels[groupBy] : '__group';

    if (groupBy !== true) newChannels[groupBy] = groupByPropName;

    const newData = [];
    bin(data).forEach((group) => {
        const newRecordBase = {
            [`__${byDim}1`]: group.x0,
            [`__${byDim}2`]: group.x1,
            [`__${byDim}`]: (group.x0 + group.x1) * 0.5
        };

        const groups = d3Groups(group, (d) => resolveChannel(groupBy, d, channels));

        for (const [groupKey, items] of groups) {
            const newRecord = {
                ...newRecordBase,
                [groupByPropName]: groupKey || 'G'
            };

            for (const k of outputs) {
                if (Reducers[options[k]]) {
                    // we have a named reducer like 'count'
                    newRecord[`__${k}`] = Reducers[options[k]](items);
                    newChannels[k] = `__${k}`;
                    // newChannels[`__${k}_origField`] = channels[k];
                } else if (typeof options[k] === 'function') {
                    // custom reducer function
                    newRecord[`__${k}`] = options[k](items);
                    newChannels[k] = `__${k}`;
                }
            }
            newData.push(newRecord);
        }
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
    options: BinXOptions = { thresholds: 'auto' }
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
    options: BinYOptions = { thresholds: 'auto' }
): TransformArg<T, DataRecord> {
    return binBy('y', { data, ...channels }, options);
}

export function bin<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: BinOptions = { thresholds: 'auto' }
): TransformArg<T, DataRecord> {
    const { domain, thresholds = 'auto' } = options;

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

    if (thresholds) {
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

    const newChannels = {
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
            __x: (groupX.x0 + groupX.x1) * 0.5
        };

        binY(groupX).forEach((groupY) => {
            const newRecordBaseY = {
                ...newRecordBaseX,
                __y1: groupY.x0,
                __y2: groupY.x1,
                __y: (groupY.x0 + groupX.x1) * 0.5
            };

            const groups = d3Groups(groupY, (d) => resolveChannel(groupBy, d, channels));

            for (const [groupKey, items] of groups) {
                const newRecord = {
                    ...newRecordBaseY,
                    [groupByPropName]: groupKey || 'G'
                };

                for (const k of outputs) {
                    if (Reducers[options[k]]) {
                        // we have a named reducer like 'count'
                        newRecord[`__${k}`] = Reducers[options[k]](items);
                        newChannels[k] = `__${k}`;
                        // newChannels[`__${k}_origField`] = channels[k];
                    } else if (typeof options[k] === 'function') {
                        // custom reducer function
                        newRecord[`__${k}`] = options[k](groupY);
                        newChannels[k] = `__${k}`;
                    }
                }
                newData.push(newRecord);
            }
        });
    });

    return { data: options.reverse ? newData.toReversed() : newData, ...newChannels };
}
