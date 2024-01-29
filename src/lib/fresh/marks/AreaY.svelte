<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels, stackY, recordizeY } from '$lib';
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

    let args = $derived(renameChannels(stackY(recordizeY({ data, ...options })), { x: 'x1' }));
</script>

<Area {...args}></Area>
