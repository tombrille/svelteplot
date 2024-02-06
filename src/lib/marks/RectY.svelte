<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Rect from './Rect.svelte';
    import { renameChannels, stackY, recordizeY } from '$lib/index.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type {
        DataRecord,
        BaseMarkStyleProps,
        ChannelAccessor,
        RectMarkProps
    } from '../types.js';

    type RectYProps = BaseMarkStyleProps & {
        data: DataRecord[];
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        stack?: StackOptions;
    } & RectMarkProps;

    let { data, stack, ...options } = $props<RectYProps>();

    let args = $derived(stackY(recordizeY({ data, ...options }), stack));
</script>

<Rect {...args}></Rect>
