<!-- @component
    Creates a vertical dot plot with y values along a single x position
-->
<script lang="ts">
    import Dot from './Dot.svelte';
    import { recordizeY } from '$lib/index.js';

    let { data = [{}], ...options } = $props();

    const args = $derived(recordizeY({ data, ...options, x: 0 }, { withIndex: false }));
</script>

<Dot {...args} />
