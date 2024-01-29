<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels, stackY, recordizeY } from '$lib/index.js';
    import type { DataRecord, BaseMarkStyleProps, ChannelAccessor } from '../types.js';

    /**
     * AreaY mark foo
     */
    type AreaYProps = BaseMarkStyleProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        /**
         * this some extensive help for the y channel
         */
        y?: ChannelAccessor;
    } & AreaMarkProps;

    let { data, stack, ...options } = $props<AreaYProps>();

    let args = $derived(
        renameChannels<AreaYProps>(stackY(recordizeY({ data, ...options }), stack), { x: 'x1' })
    );
</script>

<!--
@component
The AreaY component can be used for foobar

-->

<Area {...args}></Area>
