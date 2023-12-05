<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import type { FrameProps } from '$lib/types';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const plot = getContext<Plot>('svelteplot');

    let { ...styleProps } = $props<FrameProps>();
</script>

<BaseMark type="frame" data={[]} channels={[]}>
    <rect
        class="frame"
        style={getBaseStyles(null, styleProps)}
        x={plot.margins.left}
        y={plot.margins.top}
        width={plot.plotWidth}
        height={plot.plotHeight}
    />
</BaseMark>

<!-- 
<text
    style="font-size: 40px;text-anchor:middle"
    dominant-baseline="central"
    opacity={0.1}
    transform="translate({plot.margins.left + plot.plotWidth * 0.5}, {plot.margins.top +
        plot.plotHeight * 0.5})">{plot.plotWidth} x {plot.plotHeight}</text
> -->

<style>
    .frame {
        stroke: currentColor;
        fill: none;
    }
</style>
