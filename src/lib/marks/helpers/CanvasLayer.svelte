<script lang="ts">
    import { getContext } from 'svelte';
    import type { PlotContext } from 'svelteplot/types';
    import { devicePixelRatio } from 'svelte/reactivity/window';

    let restProps: {} = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());
</script>

<!-- 
    @component The CanvasLayer component is a helper component that inserts a 
    canvas element inside a foreignObject for use in a plot and takes care of 
    scaling it to the device pixel ratio.
-->

<foreignObject x="0" y="0" width={plot.width} height={plot.height}>
    <canvas
        xmlns="http://www.w3.org/1999/xhtml"
        {...restProps}
        width={plot.width * (devicePixelRatio.current ?? 1)}
        height={plot.height * (devicePixelRatio.current ?? 1)}
        style="width: {plot.width}px; height: {plot.height}px;"></canvas>
</foreignObject>

<style>
    foreignObject,
    canvas {
        color: currentColor;
    }
</style>
