<script>
    /** 
     * @license        
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch 
     */
    import Dot from './Dot.svelte';
    import { recordizeY } from '$lib';

    let { data, ...options } = $props();

    let args = $derived(recordizeY({ data, ...options, x: 0 }, { withIndex: false }));
</script>

<Dot {...args}>dot</Dot>
