<!-- @component
    Creates a vertical area chart with y value and baseline. Areas are implicitly 
    stacked vertically if just the y channel is defined.
-->
<script lang="ts">
    import Area, { type AreaMarkProps } from './Area.svelte';
    import { renameChannels } from '$lib/transforms/rename.js';
    import { stackY } from '$lib/transforms/stack.js';
    import { recordizeY } from '$lib/transforms/recordize.js';
    import type { ChannelAccessor, DefaultOptions } from '../types.js';
    import { getContext } from 'svelte';

    /**
     * AreaY mark foo
     */
    type AreaYProps = Omit<AreaMarkProps, 'x1' | 'x2'> & {
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    };

    let markProps: AreaMarkProps = $props();

    const DEFAULTS = getContext<DefaultOptions>('svelteplot/_defaults').areaY;

    const { data, stack, ...options }: AreaMarkProps = $derived({ ...DEFAULTS, ...markProps });

    const args = $derived(
        renameChannels<AreaYProps>(
            stackY(recordizeY({ data, ...options, x1: null, x2: null }), stack),
            { x: 'x1' }
        )
    );
</script>

<Area {...args}></Area>
