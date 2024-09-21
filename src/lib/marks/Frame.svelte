<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import type { PlotContext, BaseRectMarkProps } from '../types.js';
    import type { BaseMarkProps } from '../types.js';
    import { resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { addEventHandlers } from './helpers/events.js';

    type FrameMarkProps = BaseMarkProps &
        BaseRectMarkProps & {
            automatic?: boolean;
        };

    let { automatic, class: className = null, ...options }: FrameMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let dx = $derived(resolveProp(options.dx, null, 0));
    let dy = $derived(resolveProp(options.dy, null, 0));
</script>

<Mark type="frame" {automatic}>
    <rect
        class={className}
        transform={dx || dy ? `translate(${dx},${dy})` : null}
        style={resolveScaledStyles({}, options, {}, plot, 'stroke')}
        x={plot.options.marginLeft}
        y={plot.options.marginTop}
        rx={resolveProp(options.rx, null, null)}
        ry={resolveProp(options.ry, null, null)}
        width={plot.facetWidth}
        height={plot.facetHeight}
        use:addEventHandlers={{ getPlotState, options: options, datum: {} }} />
</Mark>

<style>
</style>
