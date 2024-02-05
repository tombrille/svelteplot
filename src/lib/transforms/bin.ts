/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord, RawValue } from '$lib/types.js';
import type { ScaledChannelName, TransformArg } from '$lib/types.js';

import {
    bin as d3Bin,
    bisect,
    extent,
    thresholdFreedmanDiaconis,
    thresholdScott,
    thresholdSturges,
    tickIncrement,
    ticks,
    type ThresholdCountGenerator
} from 'd3-array';

type NamedThresholdsGenerator = 'auto'|'scott'|'sturges'|'freedman-diaconis';

type BinOptions = {
    domain?: [number, number],
    thresholds?: NamedThresholdsGenerator|number|number[]|ThresholdCountGenerator,
    interval: number,
    cumulative: false|1|-1
}

const ThresholdGenerators:{[k in NamedThresholdsGenerator] : ThresholdCountGenerator} = {
    auto: thresholdScott,
    scott: thresholdScott,
    sturges: thresholdSturges,
    'freedman-diaconis': thresholdFreedmanDiaconis
};

const Reducers = {
    count: (group: DataRecord[]) => group.length,
    first: (group: DataRecord[]) => group[0],
    last: (group: DataRecord[]) => group.at(-1),
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

    const { domain, thresholds = 'auto'} = options;
    
    const bin = d3Bin();
    if (domain) bin.domain(domain);
    if (thresholds) bin.thresholds(
        // use a generator
        typeof thresholds === 'string' && ThresholdGenerators[thresholds] !== undefined ? 
            ThresholdGenerators[thresholds] : thresholds);
   
    // channels.x is the input 
    bin.value((d) => resolveChannel('x', d, channels));

    // y, y1, y2, fill, stroke, etc are outputs
    const outputs = ['y', 'y1', 'y2', 'fill', 'stroke'];

    const newChannels = {
        insetLeft: 0,
        insetRight: 1,
        ...channels, 
        x: '__x',
        x1: '__x1',
        x2: '__x2',
        __x_origField: typeof channels['x'] === 'string' ? channels['x'] : null,
    }

    const newData = bin(data).map(group => {
        const newRecord = { __x1: group.x0, __x2: group.x1, __x: (group.x0 + group.x1) * 0.5 };
        for (const k of outputs) {
            if (Reducers[channels[k]]) {
                // we have a named reducer like 'count'
                newRecord[`__${k}`] = Reducers[channels[k]](group);
                newChannels[k] = `__${k}`;
                newChannels[`__${k}_origField`] = channels[k];
            }
        }
        return newRecord;
    });

    return { data: newData, ...newChannels };
}

export function binY<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: RenameChannelsOptions
): TransformArg<T, DataRecord> {
    return { data, ...channels };
}

export function bin<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: RenameChannelsOptions
): TransformArg<T, DataRecord> {
    return { data, ...channels };
}

function binN(data, channels, ) {

    // binning works in two basic steps:
    
    // 1. divide the data into bins
    // 2. perform a metric on each bin to map



}
