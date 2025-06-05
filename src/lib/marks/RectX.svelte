<!-- @component
    Convenience wrapper for rectangles oriented along the x axis 
-->
<script module lang="ts">
    export type RectXMarkProps = Omit<RectMarkProps, 'y'> & { stack?: Partial<StackOptions> };
</script>

<script lang="ts">
    import Rect, { type RectMarkProps } from './Rect.svelte';
    import { intervalY, stackX, recordizeX } from '$lib/index.js';
    import type { PlotContext, PlotDefaults } from '../types.js';
    import { getContext } from 'svelte';
    import type { StackOptions } from '$lib/transforms/stack';

    let markProps: RectXMarkProps = $props();

    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').rect,
        ...getContext<PlotDefaults>('svelteplot/_defaults').rectX
    };

    const {
        data = [{}],
        stack,
        ...options
    }: RectXMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const args = $derived(stackX(intervalY(recordizeX({ data, ...options }), { plot }), stack));
</script>

<Rect {...args}></Rect>
