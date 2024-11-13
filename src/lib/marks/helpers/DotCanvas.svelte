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

    function drawSymbolPath(symbolType: string, size: number, context) {
        // maybeSymbol(symbolType).draw(context, size);
        return d3Symbol(maybeSymbol(symbolType), size).context(context)();
    }

    let _plotSize = $state([plot.width, plot.height]);
    let _usedScales = $state(usedScales);
    let _markOptions = $state(mark.options);

    const filteredData = $derived(
        data.filter((datum) => testFilter(datum, _markOptions) && testFacet(datum, _markOptions))
    );

    let _filteredData = $state(filteredData);

    $effect(() => {
        // update _usedScales only if changed
        if (!isEqual(usedScales, _usedScales)) {
            _usedScales = usedScales;
        }
        if (!isEqual(mark.options, _markOptions)) {
            _markOptions = mark.options;
        }
        const plotSize = [plot.width, plot.height];
        if (!isEqual(plotSize, _plotSize)) {
            _plotSize = plotSize;
        }
        if (_markOptions.filter ? !isEqual(filteredData, _filteredData) : filteredData.length !== _filteredData.length) {
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

        for (const datum of _filteredData) {
            // untrack the filter test to avoid redrawing when not necessary
            const x = resolveChannel('x', datum, _markOptions);
            const y = resolveChannel('y', datum, _markOptions);
            const r = resolveChannel('r', datum, _markOptions) || 2;
            const symbol_ = resolveChannel('symbol', datum, {
                symbol: 'circle',
                ..._markOptions
            });
            const symbol = _usedScales.symbol ? plotScales.symbol.fn(symbol_) : symbol_;

            if (isValid(x) && isValid(y) && isValid(r)) {
                const [px, py] = projectXY(plotScales, x, y, true, true);

                const r_ = _usedScales.r ? plotScales.r.fn(r) : r;
                const size = r_ * r_ * Math.PI * devicePixelRatio;
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
                context.translate(px, py);

                context.beginPath();
                drawSymbolPath(symbol, size, context);
                context.closePath();

                if (opacity != null) context.globalAlpha = opacity ?? 1;
                if (fillOpacity != null) context.globalAlpha = (opacity ?? 1) * fillOpacity;
                if (fill && fill !== 'none') context.fill();
                if (strokeOpacity != null) context.globalAlpha = (opacity ?? 1) * strokeOpacity;
                if (stroke && stroke !== 'none') context.stroke();
                context.translate(-px, -py);
            }
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
