<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import type { PlotContext, DataRecord, RectMarkProps } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import type { BaseMarkStyleProps } from '../types.js';
    import { resolveProp } from '../helpers/resolve.js';

    let { automatic, ...options } = $props<
        BaseMarkStyleProps &
            RectMarkProps & {
                automatic?: boolean;
            }
    >();

    const { state } = getContext<PlotContext>('svelteplot');
    let plot = $derived(state());

    let dx = $derived(resolveProp(options.dx, null, 0));
    let dy = $derived(resolveProp(options.dy, null, 0));
</script>

<Mark type="frame" {automatic}>
    <rect
        transform={dx || dy ? `translate(${dx},${dy})` : null}
        style={getBaseStyles(null, options)}
        style:stroke={options.fill ? null : resolveProp(options.stroke, {}) || 'currentColor'}
        x={plot.options.marginLeft}
        y={plot.options.marginTop}
        rx={resolveProp(options.rx, null, null)}
        ry={resolveProp(options.ry, null, null)}
        width={plot.plotWidth}
        height={plot.plotHeight}
    />
</Mark>

<style>
    rect {
        stroke: none;
        fill: none;
    }
</style>
