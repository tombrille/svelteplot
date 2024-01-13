<script lang="ts">
    import '../app.scss';
    import type { Datasets } from '$lib/types.js';
    import { setContext } from 'svelte';

    const { data } = $props<Datasets>();

    setContext('data', data);
</script>

<svelte:head></svelte:head>

<slot />
