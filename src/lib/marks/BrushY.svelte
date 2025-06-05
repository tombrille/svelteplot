<script module lang="ts">
    export type BrushYMarkProps = Omit<BrushMarkProps, 'limitDimension'>;
</script>

<script lang="ts">
    import Brush, { type BrushMarkProps } from './Brush.svelte';
    import type { PlotDefaults } from '../types.js';
    import { getContext } from 'svelte';

    let { brush = $bindable(), ...options }: BrushYMarkProps = $props();
    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').brush,
        ...getContext<PlotDefaults>('svelteplot/_defaults').brushY
    };
</script>

<Brush bind:brush limitDimension="y" {...DEFAULTS} {...options} />
