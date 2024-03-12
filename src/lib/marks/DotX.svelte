<script lang="ts">
    import Dot from './Dot.svelte';
    import { recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, DataRow } from '../types.js';
    import type { ChannelAccessor } from '$lib/types.js';

    type DotXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
    };

    let { data, ...options } = $props<DotXProps>();

    let args = $derived(recordizeX<DotXProps>({ data, ...options, y: 0 }, { withIndex: false }));
</script>

<Dot {...args}>dot</Dot>
