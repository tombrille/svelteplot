<script lang="ts">
    import Cell from './Cell.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, DataRow, RectMarkProps } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    type CellXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
    } & RectMarkProps;

    let { data = [{}], ...options }: CellXProps = $props();

    let args = $derived(
        recordizeX<CellXProps>(
            { data, fill: options.stroke == null ? (d) => d : null, ...options, y: 0 },
            { withIndex: false }
        )
    );
</script>

<Cell {...args}></Cell>
