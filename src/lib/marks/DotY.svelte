<script>
    import Dot from './Dot.svelte';
    import { recordizeY } from '$lib';

    let { data = [{}], ...options } = $props();

    let args = $derived(recordizeY({ data, ...options, x: 0 }, { withIndex: false }));
</script>

<Dot {...args}>dot</Dot>
