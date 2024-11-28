<script lang="ts">
    import Rect from './Rect.svelte';
    import { intervalX, stackY, recordizeY } from '$lib/index.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type {
        DataRecord,
        BaseMarkProps,
        ChannelAccessor,
        BaseRectMarkProps,
        PlotContext
    } from '../types.js';
    import { getContext } from 'svelte';

    type RectYMarkProps = BaseMarkProps & {
        data: DataRecord[];
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        stack?: StackOptions;
        interval?: number | string;
    } & BaseRectMarkProps;

    let { data = [{}], stack, ...options }: RectYMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(stackY(intervalX(recordizeY({ data, ...options }), { plot }), stack));
</script>

<Rect {...args}></Rect>
