<!-- @component
    Convenience wrapper for rectangles oriented along the x axis 
-->
<script lang="ts" generics="Datum extends DataRecord">
    interface RectYMarkProps extends Omit<ComponentProps<typeof Rect>, 'y'> {
        stack?: Partial<StackOptions>;
    }
    import Rect from './Rect.svelte';
    import { intervalX, stackY, recordizeY } from 'svelteplot';
    import type { DataRecord, PlotContext, PlotDefaults } from '../types/index.js';
    import { getContext, type ComponentProps } from 'svelte';
    import type { StackOptions } from '$lib/transforms/stack.js';

    let markProps: RectYMarkProps = $props();

    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').rect,
        ...getContext<PlotDefaults>('svelteplot/_defaults').rectY
    };

    const {
        data = [{} as Datum],
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
