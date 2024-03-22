<script lang="ts">
    import Vector, { type VectorMarkProps } from './Vector.svelte';
    let { data, ...options }:VectorMarkProps = $props();
</script>

<Vector 
    {data} 
    fill={options.stroke || 'currentColor'} 
    fillOpacity={0.3} 
    strokeWidth={1} 
    anchor="start" 
    sort={{ channel: '-y' }}
    {...options} 
    shape="spike" />