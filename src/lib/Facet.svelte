<script lang="ts">
    import { setContext } from 'svelte';

    let { fx, fy } = $props();
    setContext('facet', () => ({ fx, fy }));
</script>

<slot />
