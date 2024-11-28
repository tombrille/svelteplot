<script lang="ts">
    import Line, { type BaseLineMarkProps } from './Line.svelte';
    import { recordizeY } from '$lib/index.js';

    let { data = [{}], ...rest }: BaseLineMarkProps = $props();
    let args = $derived(recordizeY({ data, ...rest }));
</script>

<Line {...args} />
