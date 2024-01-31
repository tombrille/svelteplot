<script lang="ts">
    import { Plot, Line } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
