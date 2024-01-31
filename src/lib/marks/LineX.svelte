<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkStyleProps } from '../types.js';

    let { data, ...rest } = $props<LineMarkProps>();
    let args = $derived(recordizeX<LineMarkProps>({ data, ...rest }));
</script>

<Line {...args} />
