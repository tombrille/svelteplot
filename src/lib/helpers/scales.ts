import {
    scaleBand,
    scaleLinear,
    scaleTime,
    scaleSqrt,
    scaleLog,
    scaleOrdinal,
    scalePoint,
    scaleSymlog,
    scalePow,
    scaleQuantile,
    scaleQuantize,
    scaleThreshold
} from 'd3-scale';
import { extent, range as d3Range, ascending } from 'd3-array';
import { scaleSequential, scaleDiverging } from 'd3-scale';
import {
    categoricalSchemes,
    isCategoricalScheme,
    isDivergingScheme,
    isOrdinalScheme,
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
    ColorScheme,
    GenericMarkOptions,
    Mark,
    MarkType,
    PlotOptions,
    PlotScales,
    PlotState,
    RawValue,
    ScaleName,
    ScaleOptions,
    ScaleType,
    ScaledChannelName
} from '../types.js';
import isDataRecord from './isDataRecord.js';
import callWithProps from './callWithProps.js';
import { interpolateLab, interpolateRound } from 'd3-interpolate';
import { coalesce, maybeNumber } from './index.js';
import { getLogTicks } from './getLogTicks.js';
import { createProjection } from './projection.js';

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
    marks: Mark<GenericMarkOptions>[],
    defaultColorScheme: ColorScheme
): PlotScales {
    const x = createScale(
        'x',
        plotOptions.x,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const y = createScale(
        'y',
        plotOptions.y,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const r = createScale(
        'r',
        plotOptions.r,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const color = createScale(
        'color',
        plotOptions.color,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const opacity = createScale(
        'opacity',
        plotOptions.opacity,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const length = createScale(
        'length',
        plotOptions.length,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    const symbol = createScale(
        'symbol',
        plotOptions.symbol,
        marks,
        plotOptions,
        plotWidth,
        plotHeight,
        plotHasFilledDotMarks,
        defaultColorScheme
    );
    // facet scales
    let fx, fy, fz;
    if (marks.find((mark) => mark.options.fz != null)) {
        // derrive fx and fy scales for facet wrap
        fz = createScale(
            'fz',
            plotOptions.fz,
            marks,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks,
            defaultColorScheme
        );

        const index = new Map(fz.domain.map((key, i) => [key, i]));
        fz.toFx = (d: RawValue) => index.get(d) % plotOptions.fz.columns;
        fz.toFy = (d: RawValue) => Math.floor(index.get(d) / plotOptions.fz.columns);

        fx = createScale(
            'fx',
            {
                ...plotOptions.fx,
                // enforce domain
                domain: d3Range(plotOptions.fz.columns)
            },
            marks,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks,
            defaultColorScheme
        );
        const newFxFn = (d: RawValue) => fx.fn(fz.toFx(d));
        Object.assign(newFxFn, fx.fn);
        fx.fn = newFxFn;

        fy = createScale(
            'fy',
            {
                ...plotOptions.fx,
                // enforce domain for rows
                domain: d3Range(Math.ceil(fz.domain.length / plotOptions.fz.columns))
            },
            marks,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks,
            defaultColorScheme
        );
        const newFyFn = (d: RawValue) => fy.fn(fz.toFy(d));
        Object.assign(newFyFn, fy.fn);
        fy.fn = newFyFn;
    } else {
        // create fx and fy scales from mark data directly
        fx = createScale(
            'fx',
            plotOptions.fx,
            marks,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks,
            defaultColorScheme
        );
        fy = createScale(
            'fy',
            plotOptions.fy,
            marks,
            plotOptions,
            plotWidth,
            plotHeight,
            plotHasFilledDotMarks,
            defaultColorScheme
        );
    }

    const projection = plotOptions.projection
        ? createProjection(
              { projOptions: plotOptions.projection, inset: plotOptions.inset },
              {
                  width: plotWidth,
                  height: plotHeight,
                  marginBottom: plotOptions.marginBottom,
                  marginLeft: plotOptions.marginLeft,
                  marginRight: plotOptions.marginRight,
                  marginTop: plotOptions.marginTop
              }
          )
        : null;
    return { x, y, r, color, opacity, length, symbol, fx, fy, fz, projection };
}

export function createScale<T extends ScaleOptions>(
    name: ScaleName,
    scaleOptions: T,
    marks: Mark<GenericMarkOptions>[],
    plotOptions: PlotOptions,
    plotWidth: number,
    plotHeight: number,
    plotHasFilledDotMarks: boolean,
    defaultColorScheme: ColorScheme
) {
    // gather all marks that use channels which support this scale
    const dataValues = new Set<RawValue>();
    const allDataValues: RawValue[] = [];
    const markTypes = new Set<MarkType>();
    const skip = new Map<ScaledChannelName, Set<symbol>>();
    let manualActiveMarks = 0;
    const propNames = new Set<string>();
    const uniqueScaleProps = new Set<string | ChannelAccessor>();
    let sortOrdinalDomain = true;

    for (const mark of marks) {
        // we only sort the scale domain alphabetically, if none of the
        // marks that map to it are using the `sort` transform. Note that
        // we're deliberately checking for !== undefined and not for != null
        // since the explicit sort transforms like shuffle will set the
        // sort channel to null to we know that there's an explicit order
        if (mark.channels.sort !== undefined) sortOrdinalDomain = false;
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
                    if (name === 'opacity' && looksLikeOpacity(channelOptions.value)) {
                        // special handling for opacity scales, where any accessor that looks like
                        // a number between 0 and 1 will be interpreted as output type
                        (skip.get(channel) as Set<symbol>).add(mark.id);
                    } else {
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
                            !looksLikeANumber(channelOptions.value) &&
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
                                const value = resolveProp(channelOptions.value, datum);
                                dataValues.add(value);
                                if (name === 'color' && scaleOptions.type === 'quantile') {
                                    allDataValues.push(value);
                                }
                            }
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

    // construct domain from data values
    const valueArr = [...dataValues.values(), ...(scaleOptions.domain || [])].filter(
        (d) => d != null
    );

    const type: ScaleType =
        scaleOptions.type === 'auto'
            ? inferScaleType(name, valueArr, markTypes)
            : scaleOptions.type;

    const isOrdinal =
        type === 'band' || type === 'point' || type === 'ordinal' || type === 'categorical';

    if (isOrdinal && sortOrdinalDomain) {
        valueArr.sort(ascending);
    }

    const domain = scaleOptions.domain
        ? scaleOptions.domain
        : type === 'band' || type === 'point' || type === 'ordinal' || type === 'categorical'
          ? name === 'y'
              ? valueArr.toReversed()
              : valueArr
          : extent(scaleOptions.zero ? [0, ...valueArr] : valueArr);

    let range;

    let fn;

    if (name === 'color') {
        // special treatment for color scales
        const { scheme, interpolate, pivot, n = 9 } = scaleOptions;

        if (type === 'categorical') {
            // categorical scale
            range = Array.isArray(scheme)
                ? scheme
                : !scheme
                  ? categoricalSchemes.get('observable10')
                  : isCategoricalScheme(scheme)
                    ? categoricalSchemes.get(scheme)
                    : ordinalScheme(scheme)(domain.length);
            fn = scaleOrdinal().domain(domain).range(range);
        } else if (type === 'quantile') {
            const scheme_ = scheme || defaultColorScheme;
            if (isOrdinalScheme(scheme_)) {
                range = ordinalScheme(scheme_)(n);

                if (scaleOptions.reverse) range.reverse();

                fn = scaleQuantile().domain(allDataValues).range(range);
            }
        } else if (type === 'quantize') {
            const scheme_ = scheme || defaultColorScheme;
            if (isOrdinalScheme(scheme_)) {
                range = ordinalScheme(scheme_)(n);
                // console.log({domain, scheme_, range})
                if (scaleOptions.reverse) range.reverse();
                fn = scaleQuantize().domain(domain).range(range);
            } else {
                throw new Error('no ordinal scheme ' + scheme_);
            }
        } else if (type === 'threshold') {
            const scheme_ = scheme || defaultColorScheme;
            if (isOrdinalScheme(scheme_)) {
                range = ordinalScheme(scheme_)(n);
                if (scaleOptions.reverse) range.reverse();
                fn = scaleThreshold().domain(domain).range(range);
            }
        } else if (type === 'linear') {
            const scheme_ = scheme || defaultColorScheme;
            if (interpolate) {
                fn = scaleSequential(domain, interpolate);
            } else if (Array.isArray(scheme_)) {
                const step = 1 / scheme_.length;
                fn = scaleSequential(
                    domain,
                    scaleLinear(d3Range(0, 1 + step / 2, step), scheme_).interpolate(interpolateLab)
                );
            } else if (
                scaleOptions.type === 'diverging' ||
                (scaleOptions.type === 'auto' && isDivergingScheme(scheme_))
            ) {
                // diverging
                const maxabs = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
                const domain_ =
                    pivot != null ? [domain[0], pivot, domain[1]] : [-maxabs, 0, maxabs];
                fn = scaleDiverging(domain_, quantitativeScheme(scheme_));
            } else if (
                scaleOptions.type === 'linear' ||
                (scaleOptions.type === 'auto' && isQuantitativeScheme(scheme_))
            ) {
                // sequential
                fn = scaleSequential(domain, quantitativeScheme(scheme_));
            } else {
                console.warn(
                    'color problem',
                    { type, scheme_, scaleOptions },
                    isQuantitativeScheme(scheme_)
                );
                // problem
                fn = () => 'red';
            }

            //
        }
        // otherwise
    } else {
        range =
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
                      padding: maybeNumber(
                          coalesce(scaleOptions.padding, plotOptions.padding, 0.15)
                      )
                  }
                : {})
        };

        fn = callWithProps(Scales[type], [], scaleProps);
        if (type === 'band' || type === 'point') {
            fn.ticks = () => domain;
        }
        if (type === 'log') {
            fn.ticks = (count: number) => getLogTicks(domain, count);
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
        autoTitle:
            type === 'time'
                ? null
                : propNames.size === 1
                  ? `${[...propNames.values()][0]}${type === 'log' ? ' (log)' : ''}`
                  : null
    };
}

/**
 * Infer a scale type based on the scale name, the data values mapped to it and
 * the mark types that are bound to the scale
 */
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
        if (
            name === 'y' &&
            (markTypes.has('barX') || markTypes.has('tickX') || markTypes.has('cell'))
        )
            return 'band';
        if (
            name === 'x' &&
            (markTypes.has('barY') || markTypes.has('tickY') || markTypes.has('cell'))
        )
            return 'band';
    }
    if (!dataValues.length) return 'linear';
    if (dataValues.length === 1) return 'point';
    if (dataValues.every(isNumberOrNull)) return name === 'r' ? 'sqrt' : 'linear';
    if (dataValues.every(isDateOrNull)) return 'time';
    if (dataValues.every(isStringOrNull)) return markTypes.has('arrow') ? 'point' : 'band';
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
    const { marginTop, marginLeft, inset } = plotOptions;
    const { insetLeft, insetRight, insetTop, insetBottom } = scaleOptions;
    return name === 'opacity'
        ? [0, 1]
        : name === 'length'
          ? [0, 20]
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

const scaledChannelNames: ScaledChannelName[] = [
    'x',
    'x1',
    'x2',
    'y',
    'y1',
    'y2',
    'r',
    'opacity',
    'fill',
    'fillOpacity',
    'stroke',
    'strokeOpacity',
    'symbol',
    'length'
];

/**
 * Mark channels can explicitely or implicitely be exempt from being
 * mapped to a scale, so everywhere where values are being mapped to
 * scales, we need to check if the the scale is supposed to be used
 * not. That's what this function is used for.
 */
export function getUsedScales(
    plot: PlotState,
    options: GenericMarkOptions,
    mark: Mark<GenericMarkOptions>
) {
    return Object.fromEntries(
        scaledChannelNames.map((channel) => {
            const scale = CHANNEL_SCALE[channel];
            const skipMarks = plot.scales[scale].skip.get(channel) || new Set();
            return [
                channel,
                !skipMarks.has(mark.id) && toChannelOption(channel, options[channel]).scale !== null
            ];
        })
    ) as { [k in ScaledChannelName]: boolean };
}

export function looksLikeANumber(input: string | number) {
    return (
        Number.isFinite(input) ||
        (typeof input === 'string' && input.trim().length > 0 && Number.isFinite(+input))
    );
}

function isWithin(number: number, min: number, max: number) {
    return Number.isFinite(number) && number >= min && number <= max;
}

function looksLikeOpacity(input: string | number) {
    return looksLikeANumber(input) && isWithin(+input, 0, 1);
}

export function projectXY(
    scales: PlotScales,
    x: RawValue,
    y: RawValue,
    useXScale = true,
    useYScale = true
) {
    if (scales.projection) {
        // TODO: pretty sure this is not how projection streams are supposed to be used
        // efficiantly, in observable plot, all data points of a mark are projected using
        // the same stream
        let x_, y_;
        const stream = scales.projection.stream({
            point(px, py) {
                x_ = px;
                y_ = py;
            }
        });
        stream.point(x, y);
        return [x_, y_];
    }
    return [useXScale ? projectX('x', scales, x) : x, useYScale ? projectY('y', scales, y) : y];
}

export function projectX(channel: 'x' | 'x1' | 'x2', scales: PlotScales, value: RawValue) {
    return (
        scales.x.fn(value) +
        (channel === 'x' && scales.x.type === 'band'
            ? scales.x.fn.bandwidth() * 0.5
            : channel === 'x2' && scales.x.type === 'band'
              ? scales.x.fn.bandwidth()
              : 0)
    );
}

export function projectY(channel: 'y' | 'y1' | 'y2', scales: PlotScales, value: RawValue) {
    return (
        scales.y.fn(value) +
        (channel === 'y' && scales.y.type === 'band'
            ? scales.y.fn.bandwidth() * 0.5
            : channel === 'y2' && scales.y.type === 'band'
              ? scales.y.fn.bandwidth()
              : 0)
    );
}
