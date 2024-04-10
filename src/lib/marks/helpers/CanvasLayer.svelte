<script lang="ts">
    let {
        canvas = $bindable(),
        devicePixelRatio = $bindable(1),
        plot
    }: {
        canvas: HTMLCanvasElement;
        devicePixelRatio: number;
        plot: PlotState;
    } = $props();

    $effect(() => {
        devicePixelRatio = window.devicePixelRatio || 1;
        const ctx = canvas.getContext('2d');
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
        bind:this={canvas}
        width={plot.width * devicePixelRatio}
        height={plot.height * devicePixelRatio}
        style="width: {plot.width}px; height: {plot.height}px;"
    />
</foreignObject>

<style>
    foreignObject,
    canvas {
        color: currentColor;
    }
</style>
