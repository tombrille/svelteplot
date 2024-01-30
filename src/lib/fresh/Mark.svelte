<script lang="ts">
    /** 
     * @license        
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch 
     */
    import { getContext, type Snippet } from 'svelte';
    import { deepEqual } from 'fast-equals';

    import { CHANNEL_SCALE } from '$lib/contants.js';
    import type {
        ScaledChannelName,
        Mark,
        MarkType,
        DataRecord,
        PlotContext,
        ChannelName,
        GenericMarkOptions,
        ChannelAccessor
    } from './types.js';

    let {
        data = [],
        type,
        channels = [],
        required = [],
        ...options
    } = $props<
        {
            data?: DataRecord[];
            automatic?: boolean;
            type: MarkType;
            channels?: ScaledChannelName[];
            required?: ScaledChannelName[];
            children?: Snippet;
        } & Partial<Record<ChannelName, ChannelAccessor>>
    >();

    const { addMark, updateMark, removeMark } = getContext<PlotContext>('svelteplot');

    const mark: Mark<GenericMarkOptions> = {
        id: Symbol(),
        type,
        channels,
        scales: new Set(
            channels
                .filter((channel) => options[channel] !== 0)
                .map((channel) => CHANNEL_SCALE[channel])
        ),
        data,
        options: { ...options }
    };

    addMark(mark);

    $effect(() => {
        if (deepEqual(options, mark.options)) return;
        mark.options = { ...options };
        updateMark(mark);
    });

    let errors = $derived(
        required
            .filter((name) => options[name] == null)
            .map((name) => `missing channel value for ${mark.type} mark: ${name}`)
    );

    $effect(() => {
        for (const name of required) {
            if (options[name] == null) throw new Error(`missing channel value: ${name}`);
        }
    });

    $effect(() => {
        if (deepEqual(data, mark.data)) return;
        mark.data = data;
        updateMark(mark);
    });

    $effect(() => {
        return () => {
            removeMark(mark);
        };
    });
</script>

{#if errors.length}
    <text transform="translate(10,10)">
        {#each errors as error, i}
            <tspan x="0" dy={i ? 14 : 0}>{error}</tspan>
        {/each}
    </text>
{:else}
    <slot {mark} />
{/if}

<style>
    text {
        stroke: var(--plot-bg);
        fill: crimson;
        font-size: 11px;
        stroke-width: 3px;
        font-weight: bold;
        paint-order: stroke fill;
    }
</style>
