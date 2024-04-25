<script lang="ts">
    import CanvasLayer from './CanvasLayer.svelte';
    import type { PlotState, Mark, DataRecord, BaseMarkProps } from '$lib/types.js';
    import { CSS_VAR } from '$lib/constants.js';
    import { isValid, testFilter } from '$lib/helpers/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyleProps } from '$lib/helpers/resolve.js';
    import { projectXY } from '$lib/helpers/scales.js';
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';

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

    $effect(() => {
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (context === null) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        // this will re-run whenever `color` or `size` change
        context.resetTransform();
        context.scale(devicePixelRatio, devicePixelRatio);
        for (const datum of data) {
            if (testFilter(datum, mark.options) && testFacet(datum, mark.options)) {
                const x = resolveChannel('x', datum, mark.options);
                const y = resolveChannel('y', datum, mark.options);
                const r = resolveChannel('r', datum, mark.options) || 2;
                const symbol_ = resolveChannel('symbol', datum, {
                    symbol: 'circle',
                    ...mark.options
                });
                const symbol = usedScales.symbol ? plot.scales.symbol.fn(symbol_) : symbol_;

                if (isValid(x) && isValid(y) && isValid(r)) {
                    const [px, py] = projectXY(plot.scales, x, y, true, true);
                    const r_ = usedScales.r ? plot.scales.r.fn(r) : r;
                    const size = r_ * r_ * Math.PI * devicePixelRatio;
                    let { stroke, strokeOpacity, fillOpacity, fill, opacity } =
                        resolveScaledStyleProps(datum, mark.options, usedScales, plot, 'stroke');

                    if (`${fill}`.toLowerCase() === 'currentcolor')
                        fill = getComputedStyle(
                            canvas.parentElement.parentElement
                        ).getPropertyValue('color');
                    if (`${stroke}`.toLowerCase() === 'currentcolor')
                        stroke = getComputedStyle(
                            canvas.parentElement.parentElement
                        ).getPropertyValue('color');
                    if (CSS_VAR.test(fill))
                        fill = getComputedStyle(canvas).getPropertyValue(fill.slice(4, -1));
                    if (CSS_VAR.test(stroke))
                        stroke = getComputedStyle(canvas).getPropertyValue(stroke.slice(4, -1));

                    if (stroke && stroke !== 'none') {
                        const strokeWidth = resolveProp(mark.options.strokeWidth, datum, 1.6);
                        context.lineWidth = strokeWidth;
                    }
                    context.fillStyle = fill ? fill : 'none';
                    context.strokeStyle = stroke ? stroke : 'none';
                    context.translate(px, py);

                    context.beginPath();
                    drawSymbolPath(symbol, size, context);
                    context.closePath();

                    if (opacity != null) context.globalAlpha = opacity;
                    if (fillOpacity != null) context.globalAlpha = (opacity ?? 1) * fillOpacity;
                    if (fill && fill !== 'none') context.fill();
                    if (strokeOpacity != null) context.globalAlpha = (opacity ?? 1) * strokeOpacity;
                    if (stroke && stroke !== 'none') context.stroke();
                    context.translate(-px, -py);
                }
            }
        }
    });
</script>

<CanvasLayer bind:canvas bind:devicePixelRatio {plot} />
