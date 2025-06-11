<!-- @component
    Geo mark with Sphere geometry object  -->

<script lang="ts">
    interface SphereMarkProps
        extends BaseMarkProps<GeoJSON.GeoJsonObject>,
            LinkableMarkProps<GeoJSON.GeoJsonObject> {}

    import { getContext } from 'svelte';
    import Geo from './Geo.svelte';
    import type { BaseMarkProps, LinkableMarkProps, PlotDefaults } from '../types/index.js';

    let markProps: SphereMarkProps = $props();

    const DEFAULTS = {
        ...getContext<PlotDefaults>('svelteplot/_defaults').sphere
    };

    const { ...options }: SphereMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });
</script>

<Geo data={[{ type: 'Sphere' }]} {...options} geoType="sphere" />
