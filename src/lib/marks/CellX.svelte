<script lang="ts">
    import Cell from './Cell.svelte';
    import { recordizeY } from '$lib/index.js';
    import type { BaseMarkProps, DataRow, RectMarkProps } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    type CellXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
    } & RectMarkProps;

    let { data = [{}], ...options }: CellXProps = $props();

    const args = $derived(
        recordizeY<CellXProps>({
            data,
            ...options
        })
    );
</script>

<Cell {...args} y="0" fill={options.fill || '__value'} />
