<script lang="ts">
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeY } from '$lib/index.js';

    let { data, ...rest } = $props<LineMarkProps>();
    let args = $derived(recordizeY<LineMarkProps>({ data, ...rest }));
</script>

<Line {...args} />
