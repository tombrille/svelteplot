<!-- @component
    Creates a horizontal dot plot with x values along a single y position
-->
<script module lang="ts">
    export type DotXMarkProps = Omit<DotMarkProps, 'y'>;
</script>

<script lang="ts">
    import Dot, { type DotMarkProps } from './Dot.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, DataRow } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    let { data = [{}], ...options }: DotXMarkProps = $props();

    const args = $derived(recordizeX({ data, ...options, y: 1 }, { withIndex: false }));
</script>

<Dot {...args} />
