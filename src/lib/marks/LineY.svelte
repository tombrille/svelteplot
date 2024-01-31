<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeY } from '$lib/index.js';

    let { data, ...rest } = $props<LineMarkProps>();
    let args = $derived(recordizeY<LineMarkProps>({ data, ...rest }));
</script>

<Line {...args} />
