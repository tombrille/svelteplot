import { scaleBand, scaleLinear, scaleTime, scaleSqrt, scaleLog, scaleOrdinal, scalePoint } from 'd3-scale';
import { scaleSequential, scaleDiverging } from 'd3-scale';
import { getLogTicks } from './getLogTicks.js';
import {
    categoricalSchemes,
    isCategoricalScheme,
    isQuantitativeScheme,
    ordinalScheme,
    quantitativeScheme
} from './colors.js';
import { isColorOrNull } from './typeChecks.js';
import type { ColorScheme, RawValue } from '$lib/types.js';
import callWithProps from './callWithProps.js';
import { count, nice } from 'd3-array';

const Scales: Record<string, (domain: number[], range: [number, number]) => (val: any) => any> = {
    point: scalePoint,
    band: scaleBand,
    linear: scaleLinear,
    time: scaleTime,
    sqrt: scaleSqrt,
    log: scaleLog,
    ordinal: scaleOrdinal,
    sequential: scaleSequential,
    diverging: scaleDiverging
};

export function createScale(type: keyof typeof Scales, domain, range, options = {}) {
    const scale = Scales[type]();

    // scale defaults
    if (type === 'band' && options.padding === undefined && options.paddingInner === undefined && options.paddingOuter === undefined) {
        options.padding = 0.2;
    }

    // allow setting arbiraty scale options
    // callWithProps(scale, { domain,})
    for (const [key, val] of Object.entries({ domain, range, ...options })) {
        if (typeof scale[key] === 'function') scale[key](val);
        else console.warn('unknown scale setter ' + key);
    }
    if (type === 'band'  || type === 'point') {
        scale.ticks = () => domain;
    }
    if (type === 'log') {
        // overwrite scaleLog's internal ticks() method
        scale.ticks = (count: number) => getLogTicks(domain, count);
        // console.log({domain})
        // console.log(getLogTicks(domain, 5))
        console.log(
            'log',
            domain,
            range,
            options,
            scaleLog().domain(domain).range(range).base(10)(1000),
            scale(1000)
        );
    }
    return scale;
}

const identity = (d) => d;

export function createColorScale(
    type,
    domain: string[] | [number, number] | [Date, Date] | [boolean | boolean],
    range: RawValue[] | null,
    scheme: ColorScheme | null
) {
    if (type === 'identity') return identity;
    if (type === 'band') {
        if (domain.every(isColorOrNull)) {
            return identity;
        }
        const colorRange = Array.isArray(range)
            ? range
            : !scheme
              ? categoricalSchemes.get('tableau10')
              : isCategoricalScheme(scheme)
                ? categoricalSchemes.get(scheme)
                : ordinalScheme(scheme)(domain.length);
        return scaleOrdinal().domain(domain).range(colorRange);
    } else if (type === 'linear') {
        const colorInterpolator = isQuantitativeScheme(scheme)
            ? quantitativeScheme(scheme)
            : quantitativeScheme('blues');
        return scaleSequential(domain, colorInterpolator);
    }
    return (d) => d;
}
