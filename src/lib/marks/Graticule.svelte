<script lang="ts">
    import Geo from './Geo.svelte';
    import { geoGraticule } from 'd3-geo';
    import type { BaseMarkProps } from '../types.js';

    let {
        step = 10,
        stepX,
        stepY,
        ...options
    } = $props<{
        stepX: number;
        stepY: number;
        step: number;
    } & BaseMarkProps>();

    let graticule = $derived.by(() => {
        const graticule = geoGraticule();
        graticule.stepMinor([stepX || step, stepY || step]);
        return graticule;
    });
</script>

<Geo data={[graticule()]} {...options} geoType="graticule" preferStroke />
