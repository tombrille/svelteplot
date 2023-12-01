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

<h1>Rules</h1>

<p>Rules are cool</p>

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
	<RuleY data={[56, 180]} stroke="turquoise" strokeWidth="3" />
	<RuleY data={[0]} />
	<Line data={aapl} x="Date" y="Close" />
</Figure>

Rules can use functions
<!-- 
<Figure>
	
	<GridX tickFormat={(date:Date) => dayjs(date).format('D\nMMM\nYYYY').split('\n')} />
	<GridY />
	<RuleX data={aapl} x="Date" y1="High" y2="Low" stroke="turquoise" />
</Figure> -->
