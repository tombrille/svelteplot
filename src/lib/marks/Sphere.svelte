<script lang="ts">
    import { type BaseMarkProps } from '$lib/types.js';
    import Geo from './Geo.svelte';

    let { ...args } = $props<BaseMarkProps>();
</script>

<Geo data={[{ type: 'Sphere' }]} {...args} geoType="sphere" />
