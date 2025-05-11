<script lang="ts">
    import { getContext } from 'svelte';
    import { Frame } from 'svelteplot';
    import Rect from 'svelteplot/marks/Rect.svelte';
    import type { PlotContext } from 'svelteplot/types.js';

    let {
        brush = {},
        stroke = 'currentColor',
        strokeDasharray = '2,3',
        strokeOpacity = 0.6,
        cursor: forceCursor,
        onbrushstart,
        onbrushend,
        onbrush
    } = $props();

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

    let dragStart = null;
    let dragInitCoordinates = [0, 0];

    let pointer = $state([0, 0]);
    const pxPointer = $derived([plot.scales.x.fn(pointer[0]), plot.scales.y.fn(pointer[1])]);
    const pxBrush = $derived({
        x1: plot.scales.x.fn(brush.x1),
        x2: plot.scales.x.fn(brush.x2),
        y1: plot.scales.y.fn(brush.y1),
        y2: plot.scales.y.fn(brush.y2)
    });

    const EDGE_SIZE = 10; // make this a prop?
    const HALF_EDGE = EDGE_SIZE * 0.5;

    const isInsideBrush = $derived(
        pxPointer[0] > pxBrush.x1 + HALF_EDGE &&
            pxPointer[0] < pxBrush.x2 - HALF_EDGE &&
            pxPointer[1] > pxBrush.y2 + HALF_EDGE &&
            pxPointer[1] < pxBrush.y1 - HALF_EDGE
    );
    /**
     *
     */
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
        // TODO: add support for Dates
        brush.x1 = constrain(Math.min(x1, x2), xDomain);
        brush.x2 = constrain(Math.max(x1, x2), xDomain);
        brush.y1 = constrain(Math.min(y1, y2), yDomain);
        brush.y2 = constrain(Math.max(y1, y2), yDomain);
    });

    function constrain(x: number, extent: number[]) {
        const minE = Math.min(...extent);
        const maxE = Math.max(...extent);
        if (x < minE) return minE;
        if (x > maxE) return maxE;
        return x;
    }

    const DRAG_DELAY = 100;

    function onmousedown(e) {
        dragging = true;
        dragStart = Date.now();
        dragInitCoordinates = [e.dataX, e.dataY];

        if (brush.enabled && isInsideBrush) {
            action = 'move';
        } else if (brush.enabled && (isXEdge || isYEdge)) {
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

        // check if new drag starts inside existing brush, if so, move the brush
    }

    function onmousemove(e) {
        pointer = [e.dataX, e.dataY];
        if (dragging) {
            const dx = e.dataX - dragInitCoordinates[0];
            const dy = e.dataY - dragInitCoordinates[1];
            if (action === 'move') {
                x1 += dx;
                x2 += dx;
                y1 += dy;
                y2 += dy;
            } else if (action === 'rect') {
                x2 = e.dataX;
                y2 = e.dataY;
            } else {
                if (action === 'e-resize' || action === 'ne-resize' || action === 'se-resize') {
                    x2 += dx;
                } else if (
                    action === 'w-resize' ||
                    action === 'nw-resize' ||
                    action === 'sw-resize'
                ) {
                    x1 += dx;
                }
                if (action === 'n-resize' || action === 'ne-resize' || action === 'nw-resize') {
                    y2 += dy;
                } else if (
                    action === 's-resize' ||
                    action === 'se-resize' ||
                    action === 'sw-resize'
                ) {
                    y1 += dy;
                }
            }
            dragInitCoordinates = [e.dataX, e.dataY];
            if (Date.now() - dragStart) brush.enabled = true;
            onbrush?.({ ...e, brush });
        }
    }

    function onmouseup(e) {
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
        x1="x1"
        x2="x2"
        y1="y1"
        y2="y2"
        {stroke}
        {strokeDasharray}
        {strokeOpacity} />
{/if}
<Frame fill="transparent" inset={-20} {cursor} {onmousedown} {onmouseup} {onmousemove} />
