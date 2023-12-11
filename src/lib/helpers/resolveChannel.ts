import { CHANNEL_SCALE } from '$lib/contants.js';
import isDataRecord from '$lib/helpers/isDataRecord.js';
import type { ChannelName, ChannelAccessor, DataRow, RawValue } from '$lib/types.js';
import isRawValue from './isRawValue.js';

type ChannelAlias = { channel: ChannelName };

export default function (
    channel: ChannelName,
    datum: DataRow,
    channels: Partial<Record<ChannelName, ChannelAccessor | ChannelAlias>>
): RawValue {
    const scale = CHANNEL_SCALE[channel];
    const maybeAccessor: ChannelAccessor | ChannelAlias =
        channel === 'z' ? channels.z || channels.fill || channels.stroke : channels[channel];
    const accessor =
        isDataRecord(maybeAccessor) && maybeAccessor?.channel
            ? channels[maybeAccessor?.channel]
            : maybeAccessor;
    if (isDataRecord(accessor) && accessor.channel)
        throw new Error('multiple channel aliases are not allowed');
    if ((channel === 'x' || channel === 'y') && Array.isArray(datum) && accessor === null) {
        // special case for [[x0,y0], [x1,y1], ...] format
        return datum[channel === 'x' ? 0 : 1];
    } else if (isDataRecord(datum)) {
        // use accessor function
        if (typeof accessor === 'function')
            return accessor(datum.___orig___ ? datum.___orig___ : datum);
        // use accessor string
        if (typeof accessor === 'string' && datum[accessor] !== undefined) return datum[accessor];
        // fallback to channel name as accessor
        if (accessor === null && datum[channel] !== undefined) return datum[channel];
        return isRawValue(accessor) ? accessor : null;
    } else {
        // return single value or accessor
        return typeof accessor === 'function'
            ? accessor(datum)
            : accessor !== null && isRawValue(accessor)
              ? accessor
              : !Array.isArray(datum) && (scale === 'x' || scale === 'y')
                ? datum
                : null;
    }
}
