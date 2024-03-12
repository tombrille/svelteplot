<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import type { PlotContext, DataRecord, RectMarkProps } from '../types.js';
    import type { BaseMarkProps } from '../types.js';
    import { resolveProp, resolveScaledStyles } from '../helpers/resolve.js';

    let { automatic, ...options } = $props<
        BaseMarkProps &
            RectMarkProps & {
                automatic?: boolean;
            }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let dx = $derived(resolveProp(options.dx, null, 0));
    let dy = $derived(resolveProp(options.dy, null, 0));
</script>

<Mark type="frame" {automatic}>
    <rect
        transform={dx || dy ? `translate(${dx},${dy})` : null}
        style={resolveScaledStyles({}, options, {}, plot, 'stroke')}
        x={plot.options.marginLeft}
        y={plot.options.marginTop}
        rx={resolveProp(options.rx, null, null)}
        ry={resolveProp(options.ry, null, null)}
        width={plot.facetWidth}
        height={plot.facetHeight}
    />
</Mark>

<style>
</style>
