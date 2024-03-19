<script lang="ts">
    import Geo from './Geo.svelte';
    import { geoGraticule } from 'd3-geo';
    import type { DefaultOptions, BaseMarkProps } from '../types.js';

    import { getContext } from 'svelte';

    const DEFAULTS = {
        graticuleStep: 10,
        ...getContext<Partial<DefaultOptions>>('svelteplot/defaults')
    };

    type GraticuleMarkProps = BaseMarkProps & {
        step?: number;
        stepX?: number;
        stepY?: number;
    };

    let {
        step = DEFAULTS.graticuleStep,
        stepX,
        stepY,
        ...options
    }: GraticuleMarkProps = $props();

    let graticule = $derived.by(() => {
        const graticule = geoGraticule();
        graticule.stepMinor([stepX || step, stepY || step]);
        return graticule;
    });
</script>

<Geo data={[graticule()]} {...options} geoType="graticule" preferStroke />
