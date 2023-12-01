<script lang="ts">
    import { Figure, Frame, Line, RuleX, RuleY } from '$lib';

    import GridX from '$lib/marks/GridX.svelte';
    import GridY from '$lib/marks/GridY.svelte';
    import type { Datasets } from '$lib/types';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');

    let cutoff1 = $state(0);
    let cutoff2 = $state(aapl.length);
</script>

cutoff1: <input type="range" bind:value={cutoff1} min={0} max={cutoff2 - 1} /><br />
cutoff2: <input type="range" bind:value={cutoff2} min={cutoff1} max={aapl.length} /><br />

<h1 class="title">Lines</h1>

<p>Lines are cool</p>

<code
    ><pre>{`<Figure>
    <GridX />
    <GridY />
    <Line data={aapl.slice(cutoff1, cutoff2)} x="Date" y="Open" /> 
</Figure>`}
    </pre></code
>

<Figure>
    <GridX />
    <GridY />
    <Line data={aapl.slice(cutoff1, cutoff2)} x="Date" y="Open" />
</Figure>
