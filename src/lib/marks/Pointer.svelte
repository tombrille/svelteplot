<script context="module" lang="ts">
    import type { ChannelAccessor, DataRow } from '$lib/types.js';

    export type PointerMarkProps = {
        data: DataRow[];
        children: Snippet<[{ data: DataRow[] }]>;
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        z?: ChannelAccessor;
        maxDistance: number;
    };
</script>

<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type { PlotContext } from '../types.js';
    import { groups as d3Groups } from 'd3-array';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    import { resolveChannel } from '$lib/helpers/resolve.js';
    import { quadtree } from 'd3-quadtree';
    import { projectX, projectXY, projectY } from '$lib/helpers/scales.js';
    import isDataRecord from '$lib/helpers/isDataRecord.js';

    let { data, children, x, y, z, maxDistance = 15 }: PointerMarkProps = $props();

    let selectedData = $state([]);

    function onMouseMove(evt: MouseEvent) {
        // find data row with minimum distance to
        const points = trees.map((tree) =>
            tree.find(x != null ? evt.layerX : 0, y != null ? evt.layerY : 0, maxDistance)
        );
        selectedData = points.filter((d) => d != null);
    }

    $effect(() => {
        plot.body?.addEventListener('mousemove', onMouseMove);

        return () => {
            plot.body?.removeEventListener('mousemove', onMouseMove);
        };
    });

    let groups = $derived(
        z != null ? d3Groups(data, (d) => resolveChannel('z', d, { x, z })) : [[null, data]]
    );

    let trees = $derived(
        groups.map(([, items]) =>
            quadtree()
                .x(x != null ? (d) => d.__pointerX : () => 0)
                .y(y != null ? (d) => d.__pointerY : () => 0)
                .addAll(
                    items?.map((d) => {
                        const [px, py] = projectXY(
                            plot.scales,
                            resolveChannel('x', d, { x }),
                            resolveChannel('y', d, { y }),
                            true,
                            true
                        );
                        return {
                            ...(isDataRecord(d) ? d : { ___orig___: d }),
                            __pointerX: px,
                            __pointerY: py
                        };
                    }) ?? []
                )
        )
    );
</script>

<g class="pointer">
    {@render children({ data: selectedData })}
</g>
