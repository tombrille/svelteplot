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
    export type AreaYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            curve: Curve | CurveFactory;
            tension: number;
            stack?: StackOptions;
        };
</script>

<script lang="ts">
    import Area from './Area.svelte';
    import { stackY, recordizeY } from '$lib';

    let { data: rawData, stack, ...rawChannels } = $props<AreaYMarkProps>();
    let { data, ...channels } = $derived(
        stackY(recordizeY({ data: rawData, ...rawChannels }), stack)
    );

    $inspect({ data, channels });
</script>

<Area {data} {...channels} />
