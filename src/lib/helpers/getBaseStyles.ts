import type { ChannelAccessor, MarkStyleProps, DataRow } from '$lib/types.js';
import { resolveProp } from './resolve.js';

const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    // fill: 'fill',
    // stroke: 'stroke',
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    opacity: 'opacity'
};

const styleDefaults: Partial<Record<MarkStyleProps, string | null>> = {
    fontWeight: 'normal'
};

export default function (datum: DataRow, props: Partial<Record<MarkStyleProps, ChannelAccessor>>) {
    return (Object.entries(styleProps) as [MarkStyleProps, string][])
        .filter(([key, cssKey]) => cssKey && props[key] != null)
        .map(
            ([key, cssKey]) =>
                `${cssKey}: ${resolveProp(props[key], datum, styleDefaults[key] || null)}`
        )
        .join(';');
}
