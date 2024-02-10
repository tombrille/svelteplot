/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import { CHANNEL_SCALE } from '$lib/contants.js';
import isDataRecord from '$lib/helpers/isDataRecord.js';
import isRawValue from '$lib/helpers/isRawValue.js';
import type {
    ScaleName,
    ChannelName,
    ScaledChannelName,
    ChannelAccessor,
    DataRow,
    RawValue,
    DataRecord,
    ConstantAccessor
} from '../types.js';

type ChannelAlias = { channel: ScaledChannelName };

export function resolveProp<T>(
    accessor: ConstantAccessor<T>,
    datum: DataRecord | null,
    _defaultValue: T | null = null
): T | null {
    if (typeof accessor === 'function') {
        // datum.___orig___ exists if an array of raw values was used as dataset and got
        // "recordized" by the recordize transform. We want to hide this wrapping to the user
        // so we're passing the original value to accessor functions instead of our wrapped record
        return datum == null ? accessor() : accessor(datum.___orig___ ? datum.___orig___ : datum);
    } else if (typeof accessor === 'string' && datum && datum[accessor] !== undefined) {
        return datum[accessor] as T;
    }
    return isRawValue(accessor) ? accessor : _defaultValue;
}

type ChannelOptions = {
    value: ChannelAccessor;
    scale?: ScaleName | null;
    channel?: ScaledChannelName | null;
};

export function toChannelOption(
    name: ScaledChannelName,
    channel: ChannelAccessor | ChannelAlias
): ChannelOptions {
    const isPositionScale = CHANNEL_SCALE[name] === 'x' || CHANNEL_SCALE[name] === 'y';
    return isDataRecord(channel)
        ? (channel as ChannelOptions)
        : {
              value: channel,
              scale:
                  (!isPositionScale && typeof channel === 'number') ||
                  typeof channel === 'undefined'
                      ? null
                      : CHANNEL_SCALE[name],
              channel: null
          };
}

export function resolveChannel(
    channel: ChannelName,
    datum: DataRow,
    channels: Partial<Record<ChannelName, ChannelAccessor | ChannelAlias>>
): RawValue {
    const scale = CHANNEL_SCALE[channel];
    // the z channel has an automatic alias mechanism
    const accessor: ChannelAccessor | ChannelAlias =
        channel === 'z' ? channels.z || channels.fill || channels.stroke : channels[channel];
    const channelOptions = toChannelOption(channel, accessor);

    if (channelOptions.channel) {
        // users can pass { channel: 'fill' } as accessor to re-use an existing channel
        return resolveChannel(channelOptions.channel, datum, channels);
    }

    return resolve(datum, channelOptions.value, channel, scale);
}

function resolve(
    datum: DataRow,
    accessor: ChannelAccessor,
    channel: ChannelName,
    scale: ScaleName
) {
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
    } else if (
        Array.isArray(datum) &&
        (typeof accessor === 'string' || typeof accessor === 'number') &&
        datum[accessor] != null
    ) {
        return datum[accessor];
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
