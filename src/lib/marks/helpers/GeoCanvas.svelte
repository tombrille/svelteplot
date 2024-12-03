<script lang="ts">
    import CanvasLayer from './CanvasLayer.svelte';
    import type { PlotState, Mark, DataRecord, BaseMarkProps } from '$lib/types.js';
    import { CSS_VAR } from '$lib/constants.js';
    import { isValid, testFilter } from '$lib/helpers/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyleProps } from '$lib/helpers/resolve.js';
    import { projectXY } from '$lib/helpers/scales.js';
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import { tick, untrack } from 'svelte';
    import { isEqual } from 'es-toolkit';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { geoPath, type GeoPath } from 'd3-geo';

    let canvas: HTMLCanvasElement | undefined = $state();
    let devicePixelRatio = $state(1);

    let {
        mark,
        plot,
        data,
        testFacet,
        usedScales
    }: {
        mark: Mark<BaseMarkProps>;
        plot: PlotState;
        data: DataRecord[];
        testFacet: any;
        usedScales: any;
    } = $props();

    const path = $derived(
        callWithProps(geoPath, [plot.scales.projection], {
            ...(options.r
                ? { pointRadius: (d) => plot.scales.r.fn(resolveChannel('r', d, options)) }
                : { pointRadius: 3 })
        }) as GeoPath
    );

    function scaleHash(scale) {
        return { domain: scale.domain, type: scale.type, range: scale.range };
    }

    let _plotSize = $state([plot.width, plot.height]);
    let _usedScales = $state(usedScales);
    let _markOptions = $state(mark.options);
    const xScale = $derived(scaleHash(plot.scales.x));
    const yScale = $derived(scaleHash(plot.scales.y));
    const rScale = $derived(scaleHash(plot.scales.r));
    let _xScale = $state(xScale);
    let _yScale = $state(yScale);
    let _rScale = $state(rScale);

    const filteredData = $derived(
        data.filter((datum) => testFilter(datum, _markOptions) && testFacet(datum, _markOptions))
    );

    let _filteredData = $state(filteredData);

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
        if (!isEqual(xScale, _xScale)) _xScale = xScale;
        if (!isEqual(yScale, _yScale)) _yScale = yScale;
        if (!isEqual(rScale, _rScale)) _rScale = rScale;
    });

    $effect(() => {
        // track plot size, since we're untracking the scales
        _plotSize;
        _markOptions;
        _xScale;
        _yScale;
        _rScale;
        const plotScales = untrack(() => plot.scales);
        const context = canvas.getContext('2d');
        if (context === null) return;
        // this will re-run whenever `color` or `size` change
        context.resetTransform();
        context.scale(devicePixelRatio, devicePixelRatio);

        path.context(context);

        for (const datum of _filteredData) {
            // untrack the filter test to avoid redrawing when not necessary
            let { stroke, strokeOpacity, fillOpacity, fill, opacity } = resolveScaledStyleProps(
                datum,
                _markOptions,
                _usedScales,
                untrack(() => plot),
                'stroke'
            );

            if (`${fill}`.toLowerCase() === 'currentcolor')
                fill = getComputedStyle(canvas.parentElement.parentElement).getPropertyValue(
                    'color'
                );
            if (`${stroke}`.toLowerCase() === 'currentcolor')
                stroke = getComputedStyle(canvas.parentElement.parentElement).getPropertyValue(
                    'color'
                );
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
        style="width: {plot.width}px; height: {plot.height}px;" />
</foreignObject>

<style>
    foreignObject,
    canvas {
        color: currentColor;
    }
</style>
