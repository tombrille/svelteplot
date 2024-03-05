<script lang="ts">
    import Geo from './Geo.svelte';
    import { geoGraticule, geoGraticule10 } from 'd3-geo';

    let { step = 10, stepX, stepY, ...options} = $props<{
        stepX: number;
        stepY: number;
        step: number;
    }>();

    let graticule = $derived.by(() => {
        const graticule = geoGraticule();
        graticule.stepMinor([stepX || step, stepY || step]);
        return graticule;
    })
</script>

<Geo data={[graticule()]} {...options} geoType="graticule" />