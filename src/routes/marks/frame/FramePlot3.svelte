<script lang="ts">
    import { Plot, Frame, Line, GridX, GridY } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<Plot testid="frame-demo" inset={10}>
    <Frame fill="#eaeaea" />
    <GridX stroke="#fff" strokeOpacity="1" />
    <GridY stroke="#fff" strokeOpacity="1" />
    <Line data={aapl} x="Date" y="Close" stroke="#222" />
</Plot>
