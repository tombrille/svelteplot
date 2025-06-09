<!--
    @component
    For creating a brush that can be dragged horizontally
-->
<script lang="ts">
    interface BrushXMarkProps extends Omit<ComponentProps<typeof Brush>, 'limitDimension'> {}

    import Brush from './Brush.svelte';
    import type { PlotDefaults, DataRecord } from '../types.js';
    import { getContext, type ComponentProps } from 'svelte';

    let { brush = $bindable({ enabled: false }), ...options }: BrushXMarkProps = $props();
    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').brush,
        ...getContext<PlotDefaults>('svelteplot/_defaults').brushX
    };
</script>

<Brush bind:brush limitDimension="x" {...DEFAULTS} {...options} />
