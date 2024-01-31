import type { Channels } from '$lib/types.js';
import type { ChannelAccessor, MarkStyleProps, DataRow } from '$lib/types.js';
import { resolveProp } from './resolve.js';

const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    fill: 'fill',
    stroke: 'stroke',
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    opacity: 'opacity',
    textAnchor: 'text-anchor'
};

const styleDefaults: Partial<Record<MarkStyleProps, string | null>> = {
    fontWeight: 'normal'
};

export default function (datum: DataRow, props: Partial<Channels>) {
    return (Object.entries(styleProps) as [MarkStyleProps, string][])
        .filter(([key, cssKey]) => cssKey && props[key] != null)
        .map(
            ([key, cssKey]) =>
                `${cssKey}: ${maybeToPixel(cssKey, resolveProp(props[key], datum, styleDefaults[key] || null))}`
        )
        .join(';');
}

function maybeToPixel(cssKey: string, value: string | number) {
    if (cssKey === 'font-size' || cssKey === 'stroke-width') {
        return typeof value === 'number' ? `${value}px` : value;
    }
    return value;
}
