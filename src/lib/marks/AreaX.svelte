<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels } from '$lib/transforms/rename.js';
    import { stackX } from '$lib/transforms/stack.js';
    import { recordizeX } from '$lib/transforms/recordize.js';
    import type { DataRecord, BaseMarkProps, ChannelAccessor } from '../types.js';

    type AreaXProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
    } & AreaMarkProps;

    let { data, stack, ...options } = $props<AreaXProps>();

    let args = $derived(
        renameChannels<AreaXProps>(stackX(recordizeX({ data, ...options }), stack), { y: 'y1' })
    );
</script>

<Area {...args}></Area>
