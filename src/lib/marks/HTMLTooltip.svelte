<script context="module" lang="ts">
    import type { ChannelAccessor, DataRow } from '$lib/types.js';

    export type HTMLTooltipMarkProps = {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        r?: ChannelAccessor;
    };
</script>

<script lang="ts">
    import { getContext } from 'svelte';
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';
    import { quadtree } from 'd3-quadtree';

    const plot = getContext<Plot>('svelteplot');

    let { data, x, y, r } = $props<HTMLTooltipMarkProps>();

    let datum = $state(false);
    let tooltipX = $state();
    let tooltipY = $state();

    function onMouseMove(evt: MouseEvent) {
        const pt = tree.find(evt.layerX, evt.layerY, 15);
        if (pt) {
            tooltipX = resolveChannel('x', pt, { x, y, r });
            tooltipY = resolveChannel('y', pt, { x, y, r });
            datum = pt;
        } else {
            datum = false;
        }
    }

    $effect(() => {
        // plot.body?.addEventListener('mouseenter', onMouseEnter);
        // plot.body?.addEventListener('mouseleave', onMouseLeave);
        plot.body?.addEventListener('mousemove', onMouseMove);

        return () => {
            // plot.body?.removeEventListener('mouseenter', onMouseEnter);
            // plot.body?.removeEventListener('mouseleave', onMouseLeave);
            plot.body?.removeEventListener('mousemove', onMouseMove);
        };
    });

    let tree = $derived(
        quadtree()
            .x((d) => plot.xScale(resolveChannel('x', d, { x, y, r })))
            .y((d) => plot.yScale(resolveChannel('y', d, { x, y, r })))
            .addAll(data)
    );
</script>

<div
    class="tooltip"
    class:hide={!!!datum}
    style:left="{tooltipX ? plot.xScale(tooltipX) : 0}px"
    style:top="{tooltipY ? plot.yScale(tooltipY) : 0}px"
>
    <div class="tooltip-body">
        <slot {datum} />
    </div>
</div>

<style>
    div.tooltip {
        background: white;
        background: var(--svelteplot-tooltip-bg);
        border: 1px solid #ccc;
        border-color: var(--svelteplot-tooltip-border);
        font-size: 13px;
        padding: 1ex 1em;
        border-radius: 3px;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
            rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        position: absolute;
        pointer-events: none;
    }
    .tooltip.hide {
        display: none;
    }
</style>
