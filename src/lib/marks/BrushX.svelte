<script module lang="ts">
    export type BrushXMarkProps = Omit<BrushMarkProps, 'limitDimension'>;
</script>

<script lang="ts">
    import Brush, { type BrushMarkProps } from './Brush.svelte';
    import type { PlotDefaults } from '../types.js';
    import { getContext } from 'svelte';

    let { brush = $bindable(), ...options }: BrushXMarkProps = $props();
    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').brush,
        ...getContext<PlotDefaults>('svelteplot/_defaults').brushX
    };
</script>

<Brush bind:brush limitDimension="x" {...DEFAULTS} {...options} />
