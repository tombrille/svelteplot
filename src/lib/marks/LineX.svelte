<script lang="ts">
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkStyleProps } from '../types.js';

    let { data, ...rest } = $props<LineMarkProps>();
    let args = $derived(recordizeX<LineMarkProps>({ data, ...rest }));
</script>

<Line {...args} />
