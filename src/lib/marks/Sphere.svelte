<script lang="ts">
    import Geo from './Geo.svelte';
    let { ...options } = $props();
</script>

<Geo data={[{ type: 'Sphere' }]} {...options} geoType="sphere" />
