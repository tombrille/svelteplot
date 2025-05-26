<!-- @component
    Convenience wrapper for rectangles oriented along the x axis 
-->
<script module lang="ts">
    export type RectXMarkProps = Omit<RectMarkProps, 'y'>;
</script>

<script lang="ts">
    import Rect, { type RectMarkProps } from './Rect.svelte';
    import { intervalY, stackX, recordizeX } from '$lib/index.js';
    import type { ChannelAccessor, PlotContext } from '../types.js';
    import { getContext } from 'svelte';

    let { data = [{}], stack, ...options }: RectXMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const args = $derived(stackX(intervalY(recordizeX({ data, ...options }), { plot }), stack));
</script>

<Rect {...args}></Rect>
