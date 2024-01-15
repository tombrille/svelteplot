<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow,
        Curve
    } from '$lib/types.js';
    import type { CurveFactory } from 'd3-shape';
    import type { StackOptions } from '$lib/transforms/stack.js';
    export type AreaXMarkProps = MarkProps &
        BaseMarkStyleProps & {
            x?: ChannelAccessor;
            x1?: ChannelAccessor;
            x2?: ChannelAccessor;
            y?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            curve: Curve | CurveFactory;
            tension: number;
            stack?: StackOptions;
        };
</script>

<script lang="ts">
    import Area from './Area.svelte';
    import { stackX, recordizeX, renameChannels } from '$lib';

    let { data: rawData, stack, ...rawChannels } = $props<AreaXMarkProps>();
    let { data, ...channels } = $derived(renameChannels(stackX(recordizeX({ data: rawData, ...rawChannels }), stack), { y: 'y1' }));
</script>

<Area
    {data}
    {...channels}
/>
