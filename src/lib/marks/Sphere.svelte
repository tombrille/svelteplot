<!-- @component
    Geo mark with Sphere geometry object  -->

<script module lang="ts">
    export let SphereMarkProps = BaseMarkProps;
</script>

<script lang="ts">
    import { type BaseMarkProps } from '$lib/types.js';
    import Geo from './Geo.svelte';

    let { ...args }: SphereMarkProps = $props();
</script>

<Geo data={[{ type: 'Sphere' }]} {...args} geoType="sphere" />
