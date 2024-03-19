<script lang="ts">
    import Rect from './Rect.svelte';
    import { intervalY, stackX, recordizeX } from '$lib/index.js';
    import type { DataRecord, BaseMarkProps, ChannelAccessor, BaseRectMarkProps } from '../types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';

    type RectXMarkProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        stack?: StackOptions;
        interval?: number | string;
    } & BaseRectMarkProps;

    let { data, stack, ...options }: RectXMarkProps = $props();

    let args = $derived(stackX(intervalY(recordizeX({ data, ...options }), { plot }), stack));
</script>

<Rect {...args}></Rect>
