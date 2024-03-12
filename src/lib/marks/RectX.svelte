<script lang="ts">
    import Rect from './Rect.svelte';
    import { renameChannels, stackX, recordizeX } from '$lib/index.js';
    import type { DataRecord, BaseMarkProps, ChannelAccessor, RectMarkProps } from '../types.js';

    type RectXProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
    } & RectMarkProps;

    let { data, stack, ...options } = $props<RectXProps>();

    let args = $derived(stackX(recordizeX({ data, ...options }), stack));
</script>

<Rect {...args}></Rect>
