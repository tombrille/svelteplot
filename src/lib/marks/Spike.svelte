<!-- 
    @component
    Wrapper around the vector mark with presets suitable for spike maps 
-->
<script module lang="ts">
    export type SpikeMarkProps = VectorMarkProps;
</script>

<script lang="ts">
    import Vector, { type VectorMarkProps } from './Vector.svelte';
    import type { PlotDefaults } from '../types.js';
    import { getContext } from 'svelte';

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

    const { data = [{}], ...options }: SpikeMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });
</script>

<Vector {data} {...options} />
