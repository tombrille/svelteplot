/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import {
    scaleBand,
    scaleLinear,
    scaleTime,
    scaleSqrt,
    scaleLog,
    scaleOrdinal,
    scalePoint,
    scaleSymlog,
    scalePow
} from 'd3-scale';
import { extent } from 'd3-array';
import { scaleSequential, scaleDiverging } from 'd3-scale';
// import { getLogTicks } from './getLogTicks.js';
import {
    categoricalSchemes,
    isCategoricalScheme,
    isDivergingScheme,
    isQuantitativeScheme,
    ordinalScheme,
    quantitativeScheme
} from './colors.js';
import { isDateOrNull, isNumberOrNull, isStringOrNull, isColorOrNull } from './typeChecks.js';
import { CHANNEL_SCALE } from '$lib/contants.js';
import { isSymbolOrNull } from './typeChecks.js';
import { resolveProp, toChannelOption } from './resolve.js';
import type {
    ChannelAccessor,
    GenericMarkOptions,
    Mark,
    MarkType,
    PlotOptions,
    PlotState,
    RawValue,
    ScaleName,
    ScaleOptions,
    ScaleType,
    ScaledChannelName
} from '../types.js';
import isDataRecord from './isDataRecord.js';
import callWithProps from './callWithProps.js';
import { interpolateRound } from 'd3-interpolate';

const Scales: Record<
    ScaleType,
    (domain?: number[], range?: [number, number]) => (val: any) => any
> = {
    point: scalePoint,
    band: scaleBand,
    linear: scaleLinear,
    time: scaleTime,
    sqrt: scaleSqrt,
    pow: scalePow,
    log: scaleLog,
    symlog: scaleSymlog,
    ordinal: scaleOrdinal,
    sequential: scaleSequential,
    diverging: scaleDiverging
};

export function computeScales(
    plotOptions: PlotOptions,
    plotWidth: number,
    plotHeight: number,
    plotHasFilledDotMarks: boolean,
    marks: Mark<GenericMarkOptions>[]
) {
    const x = createScale(
        'x',
        plotOptions.x,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const y = createScale(
        'y',
        plotOptions.y,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const r = createScale(
        'r',
        plotOptions.r,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const color = createScale(
        'color',
        plotOptions.color,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const opacity = createScale(
        'opacity',
        plotOptions.opacity,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const length = createScale(
        'length',
        plotOptions.length,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const symbol = createScale(
        'symbol',
        plotOptions.symbol,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const fx = createScale(
        'fx',
        plotOptions.fx,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    const fy = createScale(
        'fy',
        plotOptions.fy,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks
    );
    return { x, y, r, color, opacity, length, symbol, fx, fy };
}

export function createScale<T extends ScaleOptions>(
    name: ScaleName,
    scaleOptions: T,
    marks: Mark<GenericMarkOptions>[],
    plotOptions: PlotOptions,
    plotWidth: number,
    plotHeight: number,
    plotHasFilledDotMarks: boolean
) {
    // gather all marks that use channels which support this scale
    const dataValues = new Set<RawValue>();
    const markTypes = new Set<MarkType>();
    const skip = new Map<ScaledChannelName, Set<symbol>>();
    let manualActiveMarks = 0;
    const propNames = new Set<string>();
    const uniqueScaleProps = new Set<string | ChannelAccessor>();

    for (const mark of marks) {
        for (const channel of mark.channels) {
            // channelOptions can be passed as prop, but most often users will just
            // pass the channel accessor or constant value, so we may need to wrap
            if (!skip.has(channel)) skip.set(channel, new Set());

            if (mark.data.length > 0) {
                const channelOptions = isDataRecord(mark.options[channel])
                    ? mark.options[channel]
                    : { value: mark.options[channel], scale: CHANNEL_SCALE[channel] };
                // check if this mark channel is using this scale, which users can prevent
                // by passing `{ scale: null }` as prop
                const useScale =
                    channelOptions.scale === name &&
                    // type number means, someone is defining a channel as constant, e.g.
                    // <Dot r={10} /> in which case we don't want to pass it through a scale
                    // typeof channelOptions.value !== 'number' &&
                    typeof channelOptions.value !== 'undefined';

                if (useScale) {
                    const isOutputType =
                        name === 'color'
                            ? isColorOrNull
                            : name === 'symbol'
                              ? isSymbolOrNull
                              : false;

                    let allValuesAreOutputType = !!isOutputType && mark.data.length > 0;

                    if (isOutputType) {
                        for (const datum of mark.data) {
                            const val = resolveProp(channelOptions.value, datum);
                            allValuesAreOutputType =
                                allValuesAreOutputType && val !== null && isOutputType(val);
                            if (!allValuesAreOutputType) break;
                        }
                    }

                    if (allValuesAreOutputType) {
                        (skip.get(channel) as Set<symbol>).add(mark.id);
                    }

                    if (
                        typeof channelOptions.value === 'string' &&
                        !channelOptions.value.startsWith('__') &&
                        mark.data[0][channelOptions.value] !== undefined
                    ) {
                        propNames.add(channelOptions.value);
                    }

                    uniqueScaleProps.add(channelOptions.value);

                    if (channelOptions.value != null && !allValuesAreOutputType) {
                        manualActiveMarks++;
                        markTypes.add(mark.type);

                        // active mark channel
                        for (const datum of mark.data) {
                            dataValues.add(resolveProp(channelOptions.value, datum));
                        }
                    }
                }

                // special handling of marks using the stackX/stackY transform
                if (
                    (name === 'x' || name === 'y') &&
                    mark.options[`__${name}_origField`] &&
                    !mark.options[`__${name}_origField`].startsWith('__')
                ) {
                    propNames.add(mark.options[`__${name}_origField`]);
                }
            } else {
                // also skip marks without data to prevent exceptions
                (skip.get(channel) as Set<symbol>).add(mark.id);
            }
        }
    }

    // const valueType =
    // construct domain from data values
    const valueArr = [...dataValues.values(), ...(scaleOptions.domain || [])];

    const type: ScaleType =
        scaleOptions.type === 'auto'
            ? inferScaleType(name, valueArr, markTypes)
            : scaleOptions.type;

    const domain = scaleOptions.domain
        ? scaleOptions.domain
        : type === 'band' || type === 'point' || type === 'ordinal' || type === 'categorical'
          ? valueArr
          : extent(scaleOptions.zero ? [0, ...valueArr] : valueArr);

    let range =
        scaleOptions?.range ||
        getScaleRange(
            name,
            scaleOptions,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks
        );

    if (scaleOptions.reverse) range.reverse();

    let fn;

    if (name === 'color') {
        // special treatment for color scales
        const { scheme } = scaleOptions;

        if (type === 'categorical') {
            // categorical scale
            range = !scheme
                ? categoricalSchemes.get('observable10')
                : isCategoricalScheme(scheme)
                  ? categoricalSchemes.get(scheme)
                  : ordinalScheme(scheme)(domain.length);
            fn = scaleOrdinal().domain(domain).range(range);
        } else if (type === 'linear') {
            const scheme_ = scheme || 'turbo';
            if (isDivergingScheme(scheme_)) {
                // diverging
                const maxabs = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
                const domain_ = [-maxabs, 0, maxabs];
                fn = scaleDiverging(domain_, quantitativeScheme(scheme_));
            } else if (isQuantitativeScheme(scheme_)) {
                // sequential
                fn = scaleSequential(domain, quantitativeScheme(scheme_));
            } else {
                // problem
                fn = () => 'red';
            }

            //
        }
        // otherwise
    } else {
        const niceTickCount =
            name === 'x' || name === 'y'
                ? Math.round(Math.abs(range[0] - range[1]) / scaleOptions.tickSpacing)
                : undefined;

        const scaleProps = {
            domain,
            range,
            ...((type === 'linear' || type === 'log') && scaleOptions.nice
                ? {
                      nice: scaleOptions.nice ? niceTickCount : true
                  }
                : {}),
            ...(type === 'linear'
                ? {
                      clamp: scaleOptions.clamp,
                      ...(scaleOptions.round ? { interpolate: interpolateRound } : {})
                  }
                : {}),
            ...(type === 'log'
                ? {
                      base: scaleOptions.base || 10
                  }
                : {}),
            ...(type === 'band' || type === 'point'
                ? {
                      align: scaleOptions.align,
                      padding: scaleOptions.padding == null ? 0.15 : scaleOptions.padding
                  }
                : {})
        };

        fn = callWithProps(Scales[type], [], scaleProps);
        if (type === 'band' || type === 'point') {
            fn.ticks = () => domain;
        }
        if (type === 'log') {
            // fn.ticks = (count: number) => getLogTicks(domain, count);
        }
    }

    return {
        type,
        domain,
        range,
        fn,
        skip,
        manualActiveMarks,
        uniqueScaleProps,
        autoTitle: propNames.size === 1 ? [...propNames.values()][0] : null
    };
}

export function inferScaleType(
    name: ScaleName,
    dataValues: RawValue[],
    markTypes: Set<MarkType>
): ScaleType {
    if (name === 'color') {
        if (!dataValues.length) return 'ordinal';
        if (dataValues.every(isNumberOrNull)) return 'linear';
        if (dataValues.every(isDateOrNull)) return 'linear';
        if (dataValues.every(isStringOrNull)) return 'categorical';
        return 'ordinal';
    }
    if (name === 'symbol') return 'ordinal';
    // for positional scales, try to pick a scale that's required by the mark types
    if ((name === 'x' || name === 'y') && markTypes.size === 1) {
        if (name === 'y' && (markTypes.has('barX') || markTypes.has('tickX'))) return 'band';
        if (name === 'x' && (markTypes.has('barY') || markTypes.has('tickY'))) return 'band';
    }
    if (!dataValues.length) return 'linear';
    if (dataValues.length === 1) return 'point';
    if (dataValues.every(isNumberOrNull)) return name === 'r' ? 'sqrt' : 'linear';
    if (dataValues.every(isDateOrNull)) return 'time';
    if (dataValues.every(isStringOrNull)) return 'band';
    return 'linear';
}

function getScaleRange(
    name: ScaleName,
    scaleOptions: ScaleOptions,
    plotOptions: PlotOptions,
    plotWidth: number,
    plotHeight: number,
    plotHasFilledDotMarks: boolean
) {
    const { marginBottom, marginTop, marginLeft, marginRight, inset } = plotOptions;
    const { insetLeft, insetRight, insetTop, insetBottom } = scaleOptions;
    return name === 'opacity'
        ? [0, 1]
        : name === 'length'
          ? [0, 10]
          : name === 'x'
            ? [
                  marginLeft + (insetLeft || inset || 0),
                  marginLeft + plotWidth - (insetRight || inset || 0)
              ]
            : name === 'y'
              ? [
                    plotHeight + marginTop - (insetBottom || inset || 0),
                    marginTop + (insetTop || inset || 0)
                ]
              : name === 'r'
                ? [0, 10]
                : name === 'symbol'
                  ? // Plot is smart enough to pick different default shapes depending on wether
                    // or not there are filled dot marks in the plot, so we have to pass this
                    // information all the way here
                    plotHasFilledDotMarks
                      ? ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']
                      : ['circle', 'plus', 'times', 'triangle2', 'asterisk', 'square2', 'diamond2']
                  : [];
}

const channelNames: ScaledChannelName[] = [
    'x',
    'x1',
    'x2',
    'y',
    'y1',
    'y2',
    'r',
    'fill',
    'stroke',
    'symbol'
];

export function getUsedScales(
    plot: PlotState,
    options: GenericMarkOptions,
    mark: Mark<GenericMarkOptions>
): { [k in ScaledChannelName]: boolean } {
    return Object.fromEntries(
        channelNames.map((channel) => {
            const scale = CHANNEL_SCALE[channel];
            const skipMarks = plot.scales[scale].skip.get(channel) || new Set();
            return [
                channel,
                !skipMarks.has(mark.id) && toChannelOption(channel, options[channel]).scale !== null
            ];
        })
    );
}
