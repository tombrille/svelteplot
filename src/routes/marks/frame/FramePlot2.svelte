<script lang="ts">
    import { Plot, Frame, Line } from '$lib/fresh/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<Plot grid testid="frame-demo" inset={20}>
    <Frame fill="yellow" fillOpacity="0.2" stroke="magenta" strokeWidth="2" strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
