<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Rect from './Rect.svelte';
    import { renameChannels, intervalX, stackY, recordizeY } from '$lib/index.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type {
        DataRecord,
        BaseMarkProps,
        ChannelAccessor,
        RectMarkProps,
        PlotContext
    } from '../types.js';
    import { getContext } from 'svelte';

    type RectYProps = BaseMarkProps & {
        data: DataRecord[];
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        stack?: StackOptions;
        interval?: number | string;
    } & RectMarkProps;

    let { data, stack, ...options } = $props<RectYProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(stackY(intervalX(recordizeY({ data, ...options }), { plot }), stack));
    $inspect(args);
</script>

<Rect {...args}></Rect>
