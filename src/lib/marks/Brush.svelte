<script module lang="ts">
    type Brush = {
        x1?: Date | number;
        x2?: Date | number;
        y1?: Date | number;
        y2?: Date | number;
        enabled: boolean;
    };

    type BrushEvent = MouseEvent & { brush: Brush };

    export type BrushMarkProps = {
        brush: Brush;
        limitDimension: false | 'x' | 'y';
        onbrushstart?: (evt: BrushEvent) => void;
        onbrushend?: (evt: BrushEvent) => void;
        onbrush?: (evt: BrushEvent) => void;
    } & Pick<
        BaseMarkProps,
        | 'cursor'
        | 'stroke'
        | 'strokeDasharray'
        | 'strokeOpacity'
        | 'strokeWidth'
        | 'strokeLinecap'
        | 'strokeDashoffset'
        | 'strokeLinejoin'
        | 'strokeMiterlimit'
    >;
</script>

<script lang="ts">
    import { getContext } from 'svelte';
    import Frame from '$lib/marks/Frame.svelte';
    import Rect from '$lib/marks/Rect.svelte';
    import type { BaseMarkProps, PlotContext } from '$lib/types.js';

    let {
        brush = $bindable({ enabled: false }),
        stroke = 'currentColor',
        strokeWidth,
        strokeDasharray = '2,3',
        strokeOpacity = 0.6,
        strokeLinecap,
        strokeDashoffset,
        strokeLinejoin,
        strokeMiterlimit,
        cursor: forceCursor,
        limitDimension = false, // 'x'|'y'|false
        onbrushstart,
        onbrushend,
        onbrush
    }: BrushMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    const xDomain = $derived(plot.scales.x.domain);
    const yDomain = $derived(plot.scales.y.domain);

    let x1 = $state(brush.x1);
    let x2 = $state(brush.x2);
    let y1 = $state(brush.y1);
    let y2 = $state(brush.y2);

    let dragging = false;
    let action:
        | 'move'
        | 'rect'
        | 'n-resize'
        | 's-resize'
        | 'w-resize'
        | 'e-resize'
        | 'ne-resize'
        | 'nw-resize'
        | 'se-resize'
        | 'sw-resize'
        | false = $state(false);

    let dragStart: number;

    let pxPointer = $state([0, 0]);

    const pxBrush = $derived({
        x1: plot.scales.x.fn(brush.x1),
        x2: plot.scales.x.fn(brush.x2),
        y1: plot.scales.y.fn(brush.y1),
        y2: plot.scales.y.fn(brush.y2)
    });

    const EDGE_SIZE = 10; // make this a prop?
    const HALF_EDGE = EDGE_SIZE * 0.5;

    const isInsideBrush = $derived(
        (limitDimension === 'y' || pxPointer[0] > pxBrush.x1 + HALF_EDGE) &&
            (limitDimension === 'y' || pxPointer[0] < pxBrush.x2 - HALF_EDGE) &&
            (limitDimension === 'x' || pxPointer[1] > pxBrush.y2 + HALF_EDGE) &&
            (limitDimension === 'x' || pxPointer[1] < pxBrush.y1 - HALF_EDGE)
    );

    const isXEdge: false | 'left' | 'right' = $derived(
        pxPointer[0] > pxBrush.x1 - HALF_EDGE && pxPointer[0] < pxBrush.x1 + HALF_EDGE
            ? 'left'
            : pxPointer[0] > pxBrush.x2 - HALF_EDGE && pxPointer[0] < pxBrush.x2 + HALF_EDGE
              ? 'right'
              : false
    );
    const isYEdge: false | 'top' | 'bottom' = $derived(
        pxPointer[1] > pxBrush.y1 - HALF_EDGE && pxPointer[1] < pxBrush.y1 + HALF_EDGE
            ? 'top'
            : pxPointer[1] > pxBrush.y2 - HALF_EDGE && pxPointer[1] < pxBrush.y2 + HALF_EDGE
              ? 'bottom'
              : false
    );

    const CURSOR_MAP = { left: 'w', right: 'e', top: 's', bottom: 'n' };

    const cursor = $derived(
        forceCursor
            ? forceCursor
            : action
              ? action === 'rect'
                  ? 'crosshair'
                  : action
              : brush.enabled && isInsideBrush
                ? 'move'
                : brush.enabled && (isXEdge || isYEdge)
                  ? `${[isYEdge, isXEdge]
                        .filter((d) => !!d)
                        .map((c) => CURSOR_MAP[c])
                        .join('')}-resize`
                  : 'crosshair'
    );

    $effect(() => {
        brush.x1 = limitDimension === 'y' ? undefined : constrain(x1 < x2 ? x1 : x2, xDomain);
        brush.x2 = limitDimension === 'y' ? undefined : constrain(x1 > x2 ? x1 : x2, xDomain);
        brush.y1 = limitDimension === 'x' ? undefined : constrain(y1 < y2 ? y1 : y2, yDomain);
        brush.y2 = limitDimension === 'x' ? undefined : constrain(y1 > y2 ? y1 : y2, yDomain);
    });

    function constrain(x: number | Date, extent: (number | Date)[]) {
        const minE = extent[0] < extent[1] ? extent[0] : extent[1];
        const maxE = extent[0] > extent[1] ? extent[0] : extent[1];
        if (x < minE) return minE;
        if (x > maxE) return maxE;
        return x;
    }

    const DRAG_DELAY = 100;

    function onpointerdown(e: MouseEvent) {
        dragging = true;
        dragStart = Date.now();
        pxPointer = [e.layerX, e.layerY];

        if (brush.enabled && isInsideBrush) {
            // drag starts inside existing brush, if so, move the brush
            action = 'move';
        } else if (brush.enabled && (isXEdge || isYEdge)) {
            // drag starts on a brush edge, so resize the brush
            action = `${[isYEdge, isXEdge]
                .filter((d) => !!d)
                .map((c) => CURSOR_MAP[c])
                .join('')}-resize` as typeof action;
        } else {
            action = 'rect';
            // new drag
            x1 = x2 = e.dataX;
            y1 = y1 = e.dataY;
        }
        onbrushstart?.({ ...e, brush });
    }

    function onpointermove(e: MouseEvent) {
        const newPos = [e.layerX, e.layerY];
        if (dragging) {
            const px = newPos[0] - pxPointer[0];
            const py = newPos[1] - pxPointer[1];
            const dx1 = plot.scales.x.fn.invert(plot.scales.x.fn(x1) + px);
            const dx2 = plot.scales.x.fn.invert(plot.scales.x.fn(x2) + px);
            const dy1 = plot.scales.y.fn.invert(plot.scales.y.fn(y1) + py);
            const dy2 = plot.scales.y.fn.invert(plot.scales.y.fn(y2) + py);
            if (action === 'move') {
                // move edges
                x1 = dx1;
                x2 = dx2;
                y1 = dy1;
                y2 = dy2;
            } else if (action === 'rect') {
                x2 = e.dataX;
                y2 = e.dataY;
            } else {
                if (action === 'e-resize' || action === 'ne-resize' || action === 'se-resize') {
                    x2 = dx2;
                } else if (
                    action === 'w-resize' ||
                    action === 'nw-resize' ||
                    action === 'sw-resize'
                ) {
                    x1 = dx1;
                }
                if (action === 'n-resize' || action === 'ne-resize' || action === 'nw-resize') {
                    y2 = dy2;
                } else if (
                    action === 's-resize' ||
                    action === 'se-resize' ||
                    action === 'sw-resize'
                ) {
                    y1 = dy1;
                }
            }
            if (Date.now() - dragStart) brush.enabled = true;
            onbrush?.({ ...e, brush });
        }
        pxPointer = [e.layerX, e.layerY];
    }

    function onpointerup(e: MouseEvent) {
        dragging = false;
        action = false;
        // fix coordinates
        if (x2 < x1) {
            const t = x2;
            x2 = x1;
            x1 = t;
        }
        if (y2 < y1) {
            const t = y2;
            y2 = y1;
            y1 = t;
        }
        brush.enabled = Date.now() - dragStart > DRAG_DELAY;
        onbrushend?.({ ...e, brush });
    }
</script>

{#if stroke && brush.enabled}
    <Rect
        data={[brush]}
        {...limitDimension === 'x' ? {} : { y1: 'y1', y2: 'y2' }}
        {...limitDimension === 'y' ? {} : { x1: 'x1', x2: 'x2' }}
        {stroke}
        {strokeDasharray}
        {strokeOpacity}
        {strokeDashoffset}
        {strokeLinecap}
        {strokeLinejoin}
        {strokeMiterlimit}
        {strokeWidth} />
{/if}
<Frame fill="transparent" inset={-20} {cursor} {onpointerdown} {onpointerup} {onpointermove} />
