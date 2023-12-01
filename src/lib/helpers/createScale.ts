import { scaleBand, scaleLinear, scaleTime, scaleSqrt } from 'd3-scale';

const Scales: Record<string, (domain: number[], range: [number, number]) => (val: any) => any> = {
    band: scaleBand,
    linear: scaleLinear,
    time: scaleTime,
    sqrt: scaleSqrt
};

export function createScale(type: keyof typeof Scales, domain, range, options = {}) {
    const scale = Scales[type](domain, range);
    // allow setting arbiraty scale options
    for (const [key, val] of Object.entries(options)) {
        scale[key](val);
    }
    return scale;
}
