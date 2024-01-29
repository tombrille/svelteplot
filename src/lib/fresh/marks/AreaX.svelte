<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels, stackX, recordizeX } from '$lib/index.js';
    import type { DataRecord, BaseMarkStyleProps, ChannelAccessor } from '../types.js';

    type AreaXProps = BaseMarkStyleProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
    } & AreaMarkProps;

    let { data, stack, ...options } = $props<AreaXProps>();

    let args = $derived(
        renameChannels<AreaXProps>(stackX(recordizeX({ data, ...options }), stack), { y: 'y1' })
    );
</script>

<Area {...args}></Area>
