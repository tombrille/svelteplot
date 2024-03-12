<script lang="ts">
    import { isValid, testFilter } from "$lib/helpers/index.js";
    import { resolveChannel, resolveProp } from "$lib/helpers/resolve.js";
    import { projectXY } from "$lib/helpers/scales.js";
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';

    let canvas: HTMLCanvasElement;
    let imageHref = $state('');

    let { mark, plot, data, testFacet, useScale } = $props();

    function drawSymbolPath(symbolType: string, size: number, context) {
        // maybeSymbol(symbolType).draw(context, size);
        return d3Symbol(maybeSymbol(symbolType), size).context(context)();
    }

    $effect(() => {
        const context = canvas.getContext('2d');
        if (context === null) return;
        context.clearRect(0, 0, canvas.width, canvas.height);

        // this will re-run whenever `color` or `size` change
        context.resetTransform();
        context.scale(2, 2);
        // context.strokeStyle = 'red';
        context.fillStyle = 'red';
        console.log(mark.options)
        for (const datum of data) {
            if (testFilter(datum, mark.options) && testFacet(datum, mark.options)) {
                const x = resolveChannel('x', datum, mark.options);
                const y = resolveChannel('y', datum, mark.options);
                const r = resolveChannel('r', datum, mark.options) || 2;
                const symbol_ = resolveChannel('symbol', datum, {
                    symbol: 'circle',
                    ...mark.options
                });
                const symbol = useScale.symbol ? plot.scales.symbol.fn(symbol_) : symbol_;

                if (isValid(x) && isValid(y) && isValid(r)) {
                    const [px, py] = projectXY(plot.scales, x, y, true, true);
                    const r_ = useScale.r ? plot.scales.r.fn(r) : r;
                    const size = r_ * r_ * Math.PI * 2;
                    // context.beginPath();
                    const fill_ = resolveChannel('fill', datum, mark.options);
                    const fill = mark.options.fill === true ? 'currentColor' : useScale.fill ? plot.scales.color.fn(fill_) : fill_;
                    const stroke_ = resolveChannel('stroke', datum, mark.options);
                    const stroke = useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_;

                    if (stroke) {
                        const strokeWidth = resolveProp(mark.options.strokeWidth, datum, 1.6);
                        context.lineWidth = strokeWidth;
                    }

                    const opacity_ = resolveChannel('opacity', datum, mark.options);
                    const opacity = useScale.opacity ? plot.scales.opacity.fn(opacity_) : opacity_;
                    if (opacity != null) context.globalAlpha = opacity;

                    if (fill) context.fillStyle = fill;
                    if (stroke) context.strokeStyle = stroke;
                    
                    context.translate(px, py);

                    context.beginPath();
                    drawSymbolPath(symbol, size, context);
                    context.closePath();
                    
                    if (fill) context.fill();
                    if (stroke) context.stroke();
                    context.translate(-px, -py);
                }
            }
        }


        imageHref = canvas.toDataURL();
    })
</script>

<foreignObject>
    <canvas bind:this={canvas} 
        width={plot.width*2} height={plot.height*2} />
</foreignObject>
<image href={imageHref} style="pointer-events: none;" width={plot.width} height={plot.height} />