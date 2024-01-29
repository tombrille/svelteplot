import type { ScaledChannelName, TransformArg } from '$lib/types.js';

type RenameChannelsOptions = Record<ScaledChannelName, ScaledChannelName>;

export function renameChannels(
    { data, ...channels }: TransformArg,
    options: RenameChannelsOptions
): TransformArg {
    const newChannels = channels;
    for (const [from, to] of Object.entries(options) as [ScaledChannelName, ScaledChannelName][]) {
        if (newChannels[from] !== undefined) {
            newChannels[to] = newChannels[from];
            delete newChannels[from];
        }
    }
    return { data, ...newChannels };
}
