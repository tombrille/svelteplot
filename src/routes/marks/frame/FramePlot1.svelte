<script lang="ts">
    import { Plot, Line } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
