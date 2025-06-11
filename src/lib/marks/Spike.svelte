<!-- 
    @component
    Wrapper around the vector mark with presets suitable for spike maps 
-->
<script lang="ts" generics="Datum extends DataRecord">
    interface SpikeMarkProps extends ComponentProps<typeof Vector> {}
    import Vector from './Vector.svelte';
    import type { DataRecord, PlotDefaults } from '../types/index.js';
    import { getContext, type ComponentProps } from 'svelte';

    let markProps: SpikeMarkProps = $props();

    const DEFAULTS = {
        fill: 'currentColor',
        fillOpacity: 0.3,
        strokeWidth: 1,
        anchor: 'start' as const,
        stroke: 'currentColor',
        sort: { channel: '-y' },
        shape: 'spike' as const,
        ...getContext<PlotDefaults>('svelteplot/_defaults').spike
    };

    const { data = [{} as Datum], ...options }: SpikeMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });
</script>

<Vector {data} {...options} />
