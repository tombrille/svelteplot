<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeX, binY } from '$lib/index.js';

    let {
        data,
        interval,
        reduce = 'first',
        ...rest
    } = $props<
        LineMarkProps & {
            interval?: string;
            reduce?: string;
        }
    >();
    let args = $derived(recordizeX<LineMarkProps>({ data, ...rest }));
    let args2 = $derived(interval ? binY(args, { interval }) : args);
</script>

<Line {...args} />
