<script lang="ts">
    import Cell from './Cell.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, DataRow, RectMarkProps } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    type CellYProps = BaseMarkProps & {
        data: DataRow[];
        y?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
    } & RectMarkProps;

    let { data = [{}], ...options }: CellYProps = $props();

    const args = $derived(
        recordizeX<CellYProps>({
            data,
            ...options
        })
    );
</script>

<Cell {...args} x="0" fill={options.fill || '__value'} />
