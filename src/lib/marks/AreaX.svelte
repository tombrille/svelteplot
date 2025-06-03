<!-- @component
    Creates a horizontal area chart with x value and baseline.  Areas are implicitly 
    stacked horizontally if just the x channel is defined.
-->
<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels } from '$lib/transforms/rename.js';
    import { stackX } from '$lib/transforms/stack.js';
    import { recordizeX } from '$lib/transforms/recordize.js';
    import type { ChannelAccessor, DefaultOptions } from '../types.js';
    import { getContext } from 'svelte';

    type AreaXProps = Omit<AreaMarkProps, 'y1' | 'y2'> & {
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    };

    let markProps: AreaMarkProps = $props();

    const DEFAULTS = getContext<DefaultOptions>('svelteplot/_defaults').areaX;

    const { data, stack, ...options }: AreaMarkProps = $derived({ ...DEFAULTS, ...markProps });

    const args = $derived(
        renameChannels<AreaXProps>(
            stackX(recordizeX({ data, ...options, y1: null, y2: null }), stack),
            { y: 'y1' }
        )
    );
</script>

<Area {...args}></Area>
