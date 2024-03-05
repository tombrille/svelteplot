<script lang="ts">
    import { getContext } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import Mark from '../Mark.svelte';
    import { geoPath } from 'd3-geo';
    import { resolveChannel, resolveScaledStyles } from '$lib/helpers/resolve.js';
    import { getUsedScales } from '$lib/helpers/scales.js';
    import callWithProps from '$lib/helpers/callWithProps.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let { data, geoType, ...options } = $props();

    let path = $derived(callWithProps(geoPath, [plot.scales.projection], {
        ...(options.r ? { pointRadius: (d) => plot.scales.r.fn(resolveChannel('r', d, options)) } : {})
    }));

</script>

<Mark type="geo" channels={['fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity', 'r']} {data} {...options} let:mark>
    {@const useScale = getUsedScales(plot, { data, ...options }, mark)}
    <g class="geo{geoType ? ` geo-${geoType}` : ''}">
    {#each data as datum}
        <path d={path(datum)} style={resolveScaledStyles(datum, options, useScale, plot, 'fill')} />
    {/each}
    </g>
</Mark>