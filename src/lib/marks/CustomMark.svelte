<!--
    @component
    For showing custom SVG marks positioned at x/y coordinates
-->
<script lang="ts" generics="Datum extends DataRecord">
    interface CustomMarkProps extends BaseMarkProps<Datum> {
        data: Datum[];
        x?: ChannelAccessor<Datum>;
        y?: ChannelAccessor<Datum>;
        children: Snippet<[{ datum: Datum; x: number; y: number }]>;
    }

    import { getContext } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        ChannelAccessor,
        BaseMarkProps
    } from 'svelteplot/types/index.js';
    import type { Snippet } from 'svelte';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    import { resolveChannel } from '$lib/helpers/resolve.js';
    import { projectXY } from '$lib/helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

    let {
        data = [{} as Datum],
        x,
        y,
        children,
        class: className = null
    }: CustomMarkProps = $props();
</script>

<GroupMultiple class="g-custom-mark {className || ''}" length={className ? 2 : data.length}>
    {#each data as datum, i (i)}
        {@const x_ = resolveChannel<Datum>('x', datum, { x, y })}
        {@const y_ = resolveChannel<Datum>('y', datum, { x, y })}
        {#if isValid(x_) && isValid(y_)}
            {@const [px, py] = projectXY(plot.scales, x_, y_)}
            <g transform="translate({px}, {py})">
                {@render children({ datum, x: px, y: py })}
            </g>
        {/if}
    {/each}
</GroupMultiple>
