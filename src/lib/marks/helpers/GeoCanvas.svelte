<script lang="ts">
    import type { PlotState, Mark, DataRecord, BaseMarkProps } from '$lib/types.js';
    import { CSS_VAR } from '$lib/constants.js';
    import { testFilter } from '$lib/helpers/index.js';
    import { resolveProp, resolveScaledStyleProps } from '$lib/helpers/resolve.js';
    import { untrack } from 'svelte';
    import { isEqual } from 'es-toolkit';
    import { type GeoPath } from 'd3-geo';

    let canvas: HTMLCanvasElement | undefined = $state();
    let devicePixelRatio = $state(1);

    let {
        mark,
        plot,
        data,
        testFacet,
        usedScales,
        path
    }: {
        mark: Mark<BaseMarkProps>;
        plot: PlotState;
        data: DataRecord[];
        testFacet: any;
        usedScales: any;
        path: GeoPath;
    } = $props();

    function scaleHash(scale) {
        return { domain: scale.domain, type: scale.type, range: scale.range };
    }

    let _plotSize = $state([plot.width, plot.height]);
    let _usedScales = $state(usedScales);
    let _markOptions = $state(mark.options);

    const filteredData = $derived(
        data.filter((datum) => testFilter(datum, _markOptions) && testFacet(datum, _markOptions))
    );

    let _filteredData: DataRecord[] = $state([]);

    $effect(() => {
        // update _usedScales only if changed
        if (!isEqual(usedScales, _usedScales)) _usedScales = usedScales;
        if (!isEqual(mark.options, _markOptions)) _markOptions = mark.options;

        const plotSize = [plot.width, plot.height];
        if (!isEqual(plotSize, _plotSize)) _plotSize = plotSize;

        if (
            _markOptions.filter
                ? !isEqual(filteredData, _filteredData)
                : filteredData.length !== _filteredData.length
        ) {
            _filteredData = filteredData;
        }
    });

    $effect(() => {
        // track plot size, since we're untracking the scales
        _plotSize;
        _markOptions;

        const plotScales = untrack(() => plot.scales);
        const context = canvas.getContext('2d');
        if (context === null) return;
        // this will re-run whenever `color` or `size` change
        context.resetTransform();
        context.scale(devicePixelRatio, devicePixelRatio);

        let currentColor;

        path.context(context);

        const plot_ = untrack(() => plot);

        for (const datum of _filteredData) {
            // untrack the filter test to avoid redrawing when not necessary
            let { stroke, fill, opacity, ...restStyles } = resolveScaledStyleProps(
                datum,
                _markOptions,
                _usedScales,
                plot_,
                'fill'
            );

            const fillOpacity = restStyles['fill-opacity'];
            const strokeOpacity = restStyles['stroke-opacity'];

            if (`${fill}`.toLowerCase() === 'currentcolor')
                fill =
                    currentColor ||
                    (currentColor = getComputedStyle(
                        canvas?.parentElement?.parentElement
                    ).getPropertyValue('color'));
            if (`${stroke}`.toLowerCase() === 'currentcolor')
                stroke =
                    currentColor ||
                    (currentColor = getComputedStyle(
                        canvas?.parentElement?.parentElement
                    ).getPropertyValue('color'));
            if (CSS_VAR.test(fill))
                fill = getComputedStyle(canvas).getPropertyValue(fill.slice(4, -1));
            if (CSS_VAR.test(stroke))
                stroke = getComputedStyle(canvas).getPropertyValue(stroke.slice(4, -1));

            if (stroke && stroke !== 'none') {
                const strokeWidth = resolveProp(_markOptions.strokeWidth, datum, 1.6);
                context.lineWidth = strokeWidth;
            }
            context.fillStyle = fill ? fill : 'none';
            context.strokeStyle = stroke ? stroke : 'none';

            context.beginPath();
            path(datum);
            context.closePath();

            if (opacity != null) context.globalAlpha = opacity ?? 1;
            if (fillOpacity != null) context.globalAlpha = (opacity ?? 1) * fillOpacity;

            if (fill && fill !== 'none') context.fill();
            if (strokeOpacity != null) context.globalAlpha = (opacity ?? 1) * strokeOpacity;
            if (stroke && stroke !== 'none') context.stroke();
        }
        return () => {
            canvas?.getContext('2d')?.clearRect(0, 0, canvas?.width, canvas?.height);
        };
    });

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

<foreignObject x="0" y="0" width={plot.width} height={plot.height}>
    <canvas
        xmlns="http://www.w3.org/1999/xhtml"
        bind:this={canvas}
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
