<script lang="ts">
    import { type BaseMarkProps } from '$lib/types.js';
    import Geo from './Geo.svelte';

    let { ...args }: BaseMarkProps = $props();
</script>

<Geo data={[{ type: 'Sphere' }]} {...args} geoType="sphere" />
