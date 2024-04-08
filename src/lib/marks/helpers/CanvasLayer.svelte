<script lang="ts">
    let {
        canvas,
        devicePixelRatio,
        plot
    }: {
        canvas: HTMLCanvasElement; // bindable
        devicePixelRatio: number; // bindable
        plot: PlotState;
    } = $props();

    $effect(() => {
        devicePixelRatio = window.devicePixelRatio || 1;
        const ctx = canvas.getContext('2d');
    });
</script>

<foreignObject x="0" y="0" width={plot.width} height={plot.height}>
    <canvas
        xmlns="http://www.w3.org/1999/xhtml"
        bind:this={canvas}
        width={plot.width * devicePixelRatio}
        height={plot.height * devicePixelRatio}
        style="width: {plot.width}px; height: {plot.height}px;"
    />
</foreignObject>
