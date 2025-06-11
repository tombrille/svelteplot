<!--
    @component
    For creating a brush that can be dragged vertically
-->
<script lang="ts">
    import Brush from './Brush.svelte';
    import type { PlotDefaults } from '../types/index.js';
    import { getContext, type ComponentProps } from 'svelte';

    interface BrushYMarkProps extends Omit<ComponentProps<typeof Brush>, 'limitDimension'> {}

    let { brush = $bindable({ enabled: false }), ...options }: BrushYMarkProps = $props();
    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').brush,
        ...getContext<PlotDefaults>('svelteplot/_defaults').brushY
    };
</script>

<Brush bind:brush limitDimension="y" {...DEFAULTS} {...options} />
