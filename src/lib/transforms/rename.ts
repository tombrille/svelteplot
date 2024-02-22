/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import type { DataRecord } from '$lib/types.js';
import type { ScaledChannelName, TransformArg } from '$lib/types.js';

type RenameChannelsOptions = Partial<Record<ScaledChannelName, ScaledChannelName>>;
type ReplaceChannelsOptions = Partial<Record<ScaledChannelName, ScaledChannelName[]>>;

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

export function replaceChannels<T>(
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: ReplaceChannelsOptions
): TransformArg<T, DataRecord> {
    const newChannels = { ...channels };
    for (const [from, to] of Object.entries(options)) {
        if (newChannels[from] !== undefined) {
            for (const t of to) {
                newChannels[t] = newChannels[from];
            }
            delete newChannels[from];
        }
    }
    console.log({ newChannels, options });
    return { data, ...newChannels };
}
