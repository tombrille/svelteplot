import {
    interpolateBlues,
    interpolateBrBG,
    interpolateBuGn,
    interpolateBuPu,
    interpolateGnBu,
    interpolateGreens,
    interpolateGreys,
    interpolateOranges,
    interpolateOrRd,
    interpolatePiYG,
    interpolatePRGn,
    interpolatePuBu,
    interpolatePuBuGn,
    interpolatePuOr,
    interpolatePuRd,
    interpolatePurples,
    interpolateRdBu,
    interpolateRdGy,
    interpolateRdPu,
    interpolateRdYlBu,
    interpolateRdYlGn,
    interpolateReds,
    interpolateSpectral,
    interpolateYlGn,
    interpolateYlGnBu,
    interpolateYlOrBr,
    interpolateYlOrRd,
    interpolateTurbo,
    interpolateViridis,
    interpolateMagma,
    interpolateInferno,
    interpolatePlasma,
    interpolateCividis,
    interpolateCubehelixDefault,
    interpolateWarm,
    interpolateCool,
    interpolateRainbow,
    interpolateSinebow,
    schemeAccent,
    schemeBlues,
    schemeBrBG,
    schemeBuGn,
    schemeBuPu,
    schemeCategory10,
    schemeDark2,
    schemeGnBu,
    schemeGreens,
    schemeGreys,
    schemeOranges,
    schemeOrRd,
    schemePaired,
    schemePastel1,
    schemePastel2,
    schemePiYG,
    schemePRGn,
    schemePuBu,
    schemePuBuGn,
    schemePuOr,
    schemePuRd,
    schemePurples,
    schemeRdBu,
    schemeRdGy,
    schemeRdPu,
    schemeRdYlBu,
    schemeRdYlGn,
    schemeReds,
    schemeSet1,
    schemeSet2,
    schemeSet3,
    schemeSpectral,
    schemeTableau10,
    schemeYlGn,
    schemeYlGnBu,
    schemeYlOrBr,
    schemeYlOrRd
} from 'd3-scale-chromatic';

import { quantize } from 'd3-interpolate';
import type { ColorScheme } from '$lib/types/index.js';

const schemeObservable10 = [
    '#4269d0',
    '#efb118',
    '#ff725c',
    '#6cc5b0',
    '#3ca951',
    '#ff8ab7',
    '#a463f2',
    '#97bbf5',
    '#9c6b4e',
    '#9498a0'
];

export const categoricalSchemes = new Map([
    ['accent', schemeAccent],
    ['category10', schemeCategory10],
    ['dark2', schemeDark2],
    ['observable10', schemeObservable10],
    ['paired', schemePaired],
    ['pastel1', schemePastel1],
    ['pastel2', schemePastel2],
    ['set1', schemeSet1],
    ['set2', schemeSet2],
    ['set3', schemeSet3],
    ['tableau10', schemeTableau10]
]);

export function isCategoricalScheme(scheme: string) {
    return scheme != null && categoricalSchemes.has(`${scheme}`.toLowerCase());
}

type SchemeGetter = (n: number) => readonly string[];

const ordinalSchemes = new Map<ColorScheme, SchemeGetter>([
    // diverging
    ['brbg', scheme11(schemeBrBG, interpolateBrBG)],
    ['prgn', scheme11(schemePRGn, interpolatePRGn)],
    ['piyg', scheme11(schemePiYG, interpolatePiYG)],
    ['puor', scheme11(schemePuOr, interpolatePuOr)],
    ['rdbu', scheme11(schemeRdBu, interpolateRdBu)],
    ['rdgy', scheme11(schemeRdGy, interpolateRdGy)],
    ['rdylbu', scheme11(schemeRdYlBu, interpolateRdYlBu)],
    ['rdylgn', scheme11(schemeRdYlGn, interpolateRdYlGn)],
    ['spectral', scheme11(schemeSpectral, interpolateSpectral)],

    // reversed diverging (for temperature data)
    ['burd', scheme11r(schemeRdBu, interpolateRdBu)],
    ['buylrd', scheme11r(schemeRdYlBu, interpolateRdYlBu)],

    // sequential (single-hue)
    ['blues', scheme9(schemeBlues, interpolateBlues)],
    ['greens', scheme9(schemeGreens, interpolateGreens)],
    ['grays', scheme9(schemeGreys, interpolateGreys)],
    ['greys', scheme9(schemeGreys, interpolateGreys)],
    ['oranges', scheme9(schemeOranges, interpolateOranges)],
    ['purples', scheme9(schemePurples, interpolatePurples)],
    ['reds', scheme9(schemeReds, interpolateReds)],

    // sequential (multi-hue)
    ['turbo', schemei(interpolateTurbo)],
    ['viridis', schemei(interpolateViridis)],
    ['magma', schemei(interpolateMagma)],
    ['inferno', schemei(interpolateInferno)],
    ['plasma', schemei(interpolatePlasma)],
    ['cividis', schemei(interpolateCividis)],
    ['cubehelix', schemei(interpolateCubehelixDefault)],
    ['warm', schemei(interpolateWarm)],
    ['cool', schemei(interpolateCool)],
    ['bugn', scheme9(schemeBuGn, interpolateBuGn)],
    ['bupu', scheme9(schemeBuPu, interpolateBuPu)],
    ['gnbu', scheme9(schemeGnBu, interpolateGnBu)],
    ['orrd', scheme9(schemeOrRd, interpolateOrRd)],
    ['pubu', scheme9(schemePuBu, interpolatePuBu)],
    ['pubugn', scheme9(schemePuBuGn, interpolatePuBuGn)],
    ['purd', scheme9(schemePuRd, interpolatePuRd)],
    ['rdpu', scheme9(schemeRdPu, interpolateRdPu)],
    ['ylgn', scheme9(schemeYlGn, interpolateYlGn)],
    ['ylgnbu', scheme9(schemeYlGnBu, interpolateYlGnBu)],
    ['ylorbr', scheme9(schemeYlOrBr, interpolateYlOrBr)],
    ['ylorrd', scheme9(schemeYlOrRd, interpolateYlOrRd)],

    // cyclical
    ['rainbow', schemeicyclical(interpolateRainbow)],
    ['sinebow', schemeicyclical(interpolateSinebow)]
]);

export function isOrdinalScheme(scheme: ColorScheme) {
    return ordinalSchemes.has(`${scheme}`.toLowerCase());
}

type ColorSchemeArray = readonly (readonly string[])[];

function scheme9(scheme: ColorSchemeArray, interpolate: (d: number) => string) {
    return (n: number) => {
        if (n === 1) return [scheme[3][1]]; // favor midpoint
        if (n === 2) return [scheme[3][1], scheme[3][2]]; // favor darker
        n = Math.max(3, Math.floor(n));
        return n > 9 ? quantize(interpolate, n) : scheme[n];
    };
}

function scheme11(scheme: ColorSchemeArray, interpolate: (d: number) => string) {
    return (n: number) => {
        if (n === 2) return [scheme[3][0], scheme[3][2]]; // favor diverging extrema
        n = Math.max(3, Math.floor(n));
        return n > 11 ? quantize(interpolate, n) : scheme[n];
    };
}

function scheme11r(scheme: ColorSchemeArray, interpolate: (d: number) => string) {
    return (n: number) => {
        if (n === 2) return [scheme[3][2], scheme[3][0]]; // favor diverging extrema
        n = Math.max(3, Math.floor(n));
        return n > 11 ? quantize((t) => interpolate(1 - t), n) : scheme[n].slice().reverse();
    };
}

function schemei(interpolate: (d: number) => string) {
    return (n: number) => quantize(interpolate, Math.max(2, Math.floor(n)));
}

function schemeicyclical(interpolate: (d: number) => string) {
    return (n: number) => quantize(interpolate, Math.floor(n) + 1).slice(0, -1);
}

export function ordinalScheme(scheme: string) {
    const s = `${scheme}`.toLowerCase();
    if (!ordinalSchemes.has(s)) throw new Error(`unknown ordinal scheme: ${s}`);
    return ordinalSchemes.get(s);
}

export function ordinalRange(scheme: string, length: number) {
    const s = ordinalScheme(scheme);
    const r = typeof s === 'function' ? s({ length }) : s;
    return r.length !== length ? r.slice(0, length) : r;
}

// If the specified domain contains only booleans (ignoring null and undefined),
// returns a corresponding range where false is mapped to the low color and true
// is mapped to the high color of the specified scheme.
export function maybeBooleanRange(domain: boolean[], scheme = 'greys') {
    const range = new Set();
    const [f, t] = ordinalRange(scheme, 2);
    for (const value of domain) {
        if (value == null) continue;
        if (value === true) range.add(t);
        else if (value === false) range.add(f);
        else return;
    }
    return [...range];
}

const quantitativeSchemes = new Map([
    // diverging
    ['brbg', interpolateBrBG],
    ['prgn', interpolatePRGn],
    ['piyg', interpolatePiYG],
    ['puor', interpolatePuOr],
    ['rdbu', interpolateRdBu],
    ['rdgy', interpolateRdGy],
    ['rdylbu', interpolateRdYlBu],
    ['rdylgn', interpolateRdYlGn],
    ['spectral', interpolateSpectral],

    // reversed diverging (for temperature data)
    ['burd', (t) => interpolateRdBu(1 - t)],
    ['buylrd', (t) => interpolateRdYlBu(1 - t)],

    // sequential (single-hue)
    ['blues', interpolateBlues],
    ['greens', interpolateGreens],
    ['grays', interpolateGreys],
    ['greys', interpolateGreys],
    ['purples', interpolatePurples],
    ['reds', interpolateReds],
    ['oranges', interpolateOranges],

    // sequential (multi-hue)
    ['turbo', interpolateTurbo],
    ['viridis', interpolateViridis],
    ['magma', interpolateMagma],
    ['inferno', interpolateInferno],
    ['plasma', interpolatePlasma],
    ['cividis', interpolateCividis],
    ['cubehelix', interpolateCubehelixDefault],
    ['warm', interpolateWarm],
    ['cool', interpolateCool],
    ['bugn', interpolateBuGn],
    ['bupu', interpolateBuPu],
    ['gnbu', interpolateGnBu],
    ['orrd', interpolateOrRd],
    ['pubugn', interpolatePuBuGn],
    ['pubu', interpolatePuBu],
    ['purd', interpolatePuRd],
    ['rdpu', interpolateRdPu],
    ['ylgnbu', interpolateYlGnBu],
    ['ylgn', interpolateYlGn],
    ['ylorbr', interpolateYlOrBr],
    ['ylorrd', interpolateYlOrRd],

    // cyclical
    ['rainbow', interpolateRainbow],
    ['sinebow', interpolateSinebow]
]);

export function isQuantitativeScheme(scheme: string) {
    return quantitativeSchemes.has(String(scheme).toLowerCase());
}

export function quantitativeScheme(scheme: string) {
    const s = `${scheme}`.toLowerCase();
    if (!quantitativeSchemes.has(s)) throw new Error(`unknown quantitative scheme: ${s}`);
    return quantitativeSchemes.get(s);
}

const divergingSchemes = new Set([
    'brbg',
    'prgn',
    'piyg',
    'puor',
    'rdbu',
    'rdgy',
    'rdylbu',
    'rdylgn',
    'spectral',
    'burd',
    'buylrd'
]);

export function isDivergingScheme(scheme: string) {
    return scheme != null && divergingSchemes.has(`${scheme}`.toLowerCase());
}
