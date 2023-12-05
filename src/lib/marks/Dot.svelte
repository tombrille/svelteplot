<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import type { BaseMarkProps, DotMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, x = null, y = null, r = 3, ...styleProps } = $props<DotMarkProps>();

    $effect(() => console.log(data));
    // console.log({r,data}, plot.radius.domain, plot.radiusScale(resolveChannel('radius', data[0], r)))
</script>

<BaseMark_Dot type="dot" {data} channels={['x', 'y', 'radius']} {x} {y} {r} {...styleProps}>
    <g class="dots">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, x)}
            {@const cy = resolveChannel('y', datum, y)}
            {#if cx !== null && cy !== null}
                <circle
                    r={typeof r === 'number'
                        ? r
                        : plot.radiusScale(resolveChannel('radius', datum, r))}
                    style={getBaseStyles(datum, styleProps)}
                    transform="translate({[plot.xScale(cx), plot.yScale(cy)]})"
                />
            {/if}
        {/each}
    </g>
</BaseMark_Dot>

<style>
    circle {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.4px;
    }
</style>
