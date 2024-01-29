<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels, stackX, recordizeX } from '$lib';
    import type { DataRecord, BaseMarkStyleProps, ChannelAccessor } from '../types.js';

    let { data, ...options } = $props<
        BaseMarkStyleProps & {
            data: DataRecord[];
            x?: ChannelAccessor;
            x1?: ChannelAccessor;
            x2?: ChannelAccessor;
            y?: ChannelAccessor;
        } & AreaMarkProps
    >();

    let args = $derived(renameChannels(stackX(recordizeX({ data, ...options })), { y: 'y1' }));
</script>

<Area {...args}></Area>
