/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord } from '$lib/types.js';
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

type BinOptions = {
    domain?: [number, number];
    thresholds?: NamedThresholdsGenerator | number | number[] | ThresholdCountGenerator;
    interval: number | string;
    cumulative: false | 1 | -1;
    reverse?: boolean;
};

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
    const outputs = [...(byDim === 'x' ? ['y', 'y1', 'y2'] : ['x', 'x1', 'x2']), 'fill', 'stroke'];

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

    console.log({ groupBy });

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
                if (Reducers[channels[k]]) {
                    // we have a named reducer like 'count'
                    newRecord[`__${k}`] = Reducers[channels[k]](items);
                    newChannels[k] = `__${k}`;
                    newChannels[`__${k}_origField`] = channels[k];
                } else if (typeof channels[k] === 'function') {
                    // console.log({k}, channels[k](group))
                    // custom reducer function
                    newRecord[`__${k}`] = channels[k](items);
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
    options: BinOptions = { thresholds: 'auto' }
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
    options: BinOptions = { thresholds: 'auto' }
): TransformArg<T, DataRecord> {
    return binBy('y', { data, ...channels }, options);
}
