import type { Channels } from '$lib/types.js';
import type { MarkStyleProps, DataRow } from '$lib/types.js';
import { resolveProp } from './resolve.js';

const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    // fill: 'fill',
    // stroke: 'stroke',
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    blend: 'mix-blend-mode',
    // fillOpacity: 'fill-opacity',
    // strokeOpacity: 'stroke-opacity',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    fontStyle: 'font-style',
    // opacity: 'opacity',
    textAnchor: 'text-anchor',
    cursor: 'cursor',
    pointerEvents: 'pointer-events'
};

const styleDefaults: Partial<Record<MarkStyleProps, string | null>> = {
    fontWeight: 'normal'
};

export function getBaseStylesObject(datum: DataRow, props: Partial<Channels>) {
    return Object.fromEntries(
        (Object.entries(styleProps) as [MarkStyleProps, string][])
            .filter(([key, cssKey]) => cssKey && props[key] != null)
            .map(([key, cssKey]) => [
                cssKey,
                maybeToPixel(cssKey, resolveProp(props[key], datum, styleDefaults[key] || null))
            ])
    );
}

export default function (datum: DataRow, props: Partial<Channels>) {
    return Object.entries(getBaseStylesObject(datum, props))
        .map(([key, value]) => `${key}: ${value}`)
        .join(';');
}

export function maybeToPixel(cssKey: string, value: string | number) {
    if (cssKey === 'font-size' || cssKey === 'stroke-width') {
        return typeof value === 'number' ? `${value}px` : value;
    }
    return value;
}
