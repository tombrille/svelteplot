import { CHANNEL_SCALE } from '$lib/contants.js';
import isDataRecord from '$lib/helpers/isDataRecord.js';
import type {
    ChannelName,
    ChannelAccessor,
    DataRow,
    RawValue,
    DataRecord,
    ConstantAccessor
} from '$lib/types.js';
import isRawValue from './isRawValue.js';

type ChannelAlias = { channel: ChannelName };

export function resolveProp<T>(
    accessor: ConstantAccessor<T>,
    datum: DataRecord,
    _defaultValue: RawValue = null
): RawValue {
    if (typeof accessor === 'function') {
        // datum.___orig___ exists if an array of raw values was used as dataset and got
        // "recordized" by the recordize transform. We want to hide this wrapping to the user
        // so we're passing the original value to accessor functions instead of our wrapped record
        return accessor(datum.___orig___ ? datum.___orig___ : datum);
    } else if (typeof accessor === 'string' && datum[accessor] !== undefined) {
        return datum[accessor];
    }
    return isRawValue(accessor) ? accessor : _defaultValue;
}

export function resolveChannel(
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
    if (isDataRecord(datum)) {
        // use accessor function
        if (typeof accessor === 'function')
            // datum.___orig___ exists if an array of raw values was used as dataset and got
            // "recordized" by the recordize transform. We want to hide this wrapping to the user
            // so we're passing the original value to accessor functions instead of our wrapped record
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
