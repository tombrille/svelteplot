import { scaleBand, scaleLinear, scaleTime, scaleSqrt, scaleLog, scaleOrdinal } from 'd3-scale';
import { getLogTicks } from './getLogTicks';

const Scales: Record<string, (domain: number[], range: [number, number]) => (val: any) => any> = {
    band: scaleBand,
    linear: scaleLinear,
    time: scaleTime,
    sqrt: scaleSqrt,
    log: scaleLog,
    ordinal: scaleOrdinal
};

export function createScale(type: keyof typeof Scales, domain, range, options = {}) {
    const scale = Scales[type](domain, range);
    // allow setting arbiraty scale options
    for (const [key, val] of Object.entries(options)) {
        if (typeof scale[key] === 'function') scale[key](val);
        else console.warn('unknown scale setter ' + key);
    }
    if (type === 'log') {
        // overwrite scaleLog's internal ticks() method
        scale.ticks = (count: number) => getLogTicks(domain, count);
        // console.log({domain})
        // console.log(getLogTicks(domain, 5))
    }
    return scale;
}
