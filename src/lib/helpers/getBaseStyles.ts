import type { ChannelAccessor, MarkStyleProps, DataRow } from '$lib/types.js';
import resolveChannel from './resolveChannel.js';

const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    fill: 'fill',
    stroke: 'stroke',
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity',
    fontSize: 'font-size',
    opacity: 'opacity'
};

export default function (datum: DataRow, props: Partial<Record<MarkStyleProps, ChannelAccessor>>) {
    return (Object.entries(styleProps) as [MarkStyleProps, string][])
        .filter(([key, cssKey]) => cssKey && props[key] != null)
        .map(([key, cssKey]) => `${cssKey}: ${resolveChannel(key, datum, props)}`)
        .join(';');
}
