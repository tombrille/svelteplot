<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Cell from './Cell.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, DataRow, RectMarkProps } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    type CellXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
    } & RectMarkProps;

    let { data, ...options } = $props<CellXProps>();

    let args = $derived(
        recordizeX<CellXProps>(
            { data, fill: options.stroke == null ? (d) => d : null, ...options, y: 0 },
            { withIndex: false }
        )
    );
</script>

<Cell {...args}></Cell>
