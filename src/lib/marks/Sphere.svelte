<!-- @component
    Geo mark with Sphere geometry object  -->

<script module lang="ts">
    import { type BaseMarkProps, type LinkableMarkProps } from '$lib/types.js';
    export type SphereMarkProps = BaseMarkProps & LinkableMarkProps;
</script>

<script lang="ts">
    import Geo from './Geo.svelte';
    import { getContext } from 'svelte';
    import type { PlotDefaults } from '../types.js';

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
