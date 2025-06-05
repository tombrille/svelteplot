<!-- @component
    Convenience wrapper for rectangles oriented along the x axis 
-->
<script module lang="ts">
    export type RectYMarkProps = Omit<RectMarkProps, 'x'> & { stack?: Partial<StackOptions> };
</script>

<script lang="ts">
    import Rect, { type RectMarkProps } from './Rect.svelte';
    import { intervalX, stackY, recordizeY } from '$lib/index.js';
    import type { PlotContext, PlotDefaults } from '../types.js';
    import { getContext } from 'svelte';
    import type { StackOptions } from '$lib/transforms/stack';

    let markProps: RectYMarkProps = $props();

    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').rect,
        ...getContext<PlotDefaults>('svelteplot/_defaults').rectY
    };

    const {
        data = [{}],
        stack,
        ...options
    }: RectYMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    const args = $derived(stackY(intervalX(recordizeY({ data, ...options }), { plot }), stack));
</script>

<Rect {...args}></Rect>
