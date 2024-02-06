<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Rect from './Rect.svelte';
    import { renameChannels, stackX, recordizeX } from '$lib/index.js';
    import type {
        DataRecord,
        BaseMarkStyleProps,
        ChannelAccessor,
        RectMarkProps
    } from '../types.js';

    type RectXProps = BaseMarkStyleProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
    } & RectMarkProps;

    let { data, stack, ...options } = $props<RectXProps>();

    let args = $derived(stackX(recordizeX({ data, ...options }), stack));
</script>

<Rect {...args}></Rect>
