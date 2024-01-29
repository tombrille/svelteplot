import type { DataRecord } from '$lib/fresh/types.js';
import type { ScaledChannelName, TransformArg } from '$lib/types.js';

type RenameChannelsOptions = Partial<Record<ScaledChannelName, ScaledChannelName>>;

export function renameChannels<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: RenameChannelsOptions
): TransformArg<T, DataRecord> {
    const newChannels = channels;
    for (const [from, to] of Object.entries(options) as [ScaledChannelName, ScaledChannelName][]) {
        if (newChannels[from] !== undefined) {
            newChannels[to] = newChannels[from];
            delete newChannels[from];
        }
    }
    return { data, ...newChannels };
}
