<script lang="ts">
	import { Figure, Frame, Line, RuleX, RuleY } from '$lib';
	import Dot from '$lib/marks/Dot.svelte';
	import GridX from '$lib/marks/GridX.svelte';
	import GridY from '$lib/marks/GridY.svelte';
	import type { Datasets } from '$lib/types';
	import { range } from 'd3-array';
	import { getContext } from 'svelte';
	import dayjs from 'dayjs';

	const { aapl } = getContext<Datasets>('data');

	let cutoff1 = $state(0);
	let cutoff2 = $state(aapl.length);
</script>

cutoff1: <input type="range" bind:value={cutoff1} min={0} max={cutoff2 - 1} /><br />
cutoff2: <input type="range" bind:value={cutoff2} min={cutoff1} max={aapl.length} /><br />

<h1>Lines</h1>

<p>Lines are cool</p>

<code
	><pre>{`<Figure>
    <GridX />
    <GridY />
    <RuleX data={[1, 2, 4, 10]} stroke="red" />
    <RuleY data={[-2, 3, 5, 10]} stroke="blue" />
</Figure>`}
    </pre></code
>

<Figure>
	<!-- <Frame /> -->
	<GridX />
	<GridY />
	<!-- <RuleX data={[1, 2, 4, 10]} stroke="red" strokeWidth="4" strokeDasharray="5,5" opacity="0.5" />
	<RuleY data={[-2, 3, 5, 10]} stroke="blue" /> -->
	<!-- <RuleY data={[0]} /> -->
	<!-- <Line data={aapl.slice(cutoff1, cutoff2)} x="Date" y="Open" stroke="green" opacity="0.1" /> -->
	<!-- <Line data={aapl.slice(cutoff1, cutoff2)} x="Date" y="Close" stroke="red" opacity="0.1" /> -->
	<RuleX data={aapl.slice(cutoff1, cutoff2)} x="Date" y1="Open" y2="Close" strokeWidth="2" stroke={(d) => d.Close > d.Open ? 'green' : 'red'} />
</Figure>

Rules can use functions
