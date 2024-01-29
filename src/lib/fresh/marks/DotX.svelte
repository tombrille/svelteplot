<script>
    import Dot from './Dot.svelte';
    import { recordizeX } from '$lib';

    let { data, ...options } = $props();

    let args = $derived(recordizeX({ data, ...options, y: 0 }, { withIndex: false }));
</script>

<Dot {...args}>dot</Dot>
