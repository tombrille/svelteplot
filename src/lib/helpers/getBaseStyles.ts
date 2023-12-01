import { MARK_PROP_CHANNEL } from '$lib/contants';
import type { ChannelAccessor, MarkStyleProps, DataRecord, DataRow } from '$lib/types';
import resolveChannel from './resolveChannel';

const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    fill: 'fill',
    stroke: 'stroke',
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity',
    opacity: 'opacity'
};

export default function (datum: DataRow, props: Partial<Record<MarkStyleProps, ChannelAccessor>>) {
    return (Object.entries(styleProps) as [MarkStyleProps, string][])
        .filter(([key, cssKey]) => cssKey && props[key] != null)
        .map(
            ([key, cssKey]) =>
                `${cssKey}: ${resolveChannel(MARK_PROP_CHANNEL[key], datum, props[key])}`
        )
        .join(';');
}
