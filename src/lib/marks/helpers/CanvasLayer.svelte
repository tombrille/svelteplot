<script lang="ts">
    import { getContext } from 'svelte';
    import type { PlotContext } from 'svelteplot/types';

    let {
        devicePixelRatio = $bindable(1),
        ...restProps
    }: {
        devicePixelRatio: number;
    } = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    // code from https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    let remove: null | (() => void) = null;

    function updatePixelRatio() {
        if (remove != null) {
            remove();
        }
        const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
        const media = matchMedia(mqString);
        media.addEventListener('change', updatePixelRatio);
        remove = () => {
            media.removeEventListener('change', updatePixelRatio);
        };
        devicePixelRatio = window.devicePixelRatio;
    }
    $effect(() => {
        updatePixelRatio();
    });
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
        width={plot.width * devicePixelRatio}
        height={plot.height * devicePixelRatio}
        style="width: {plot.width}px; height: {plot.height}px;"></canvas>
</foreignObject>

<style>
    foreignObject,
    canvas {
        color: currentColor;
    }
</style>
