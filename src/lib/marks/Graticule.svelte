<!-- @component
    Renders a geographic graticule grid with customizable step sizes
-->
<script module lang="ts">
    import type { PlotDefaults, BaseMarkProps } from '../types.js';
    export type GraticuleMarkProps = Omit<
        BaseMarkProps,
        'fill' | 'fillOpacity' | 'paintOrder' | 'title' | 'href' | 'target' | 'cursor'
    > & {
        step?: number;
        stepX?: number;
        stepY?: number;
    };
</script>

<script lang="ts">
    import Geo from './Geo.svelte';
    import { geoGraticule } from 'd3-geo';
    import { getContext } from 'svelte';
    import type { PlotDefaults } from '../types.js';

    let markProps: GraticuleMarkProps = $props();

    const DEFAULTS = {
        step: 10,
        ...getContext<PlotDefaults>('svelteplot/_defaults').graticule
    };

    const {
        data = [{}],
        class: className = '',
        ...options
    }: GraticuleMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });

    let graticule = $derived.by(() => {
        const graticule = geoGraticule();
        graticule.stepMinor([options.stepX || options.step, options.stepY || options.step]);
        return graticule;
    });
</script>

<Geo data={[graticule()]} {...options} geoType="graticule" preferStroke />
