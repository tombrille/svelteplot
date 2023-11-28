<script lang="ts">
	import { Figure, Frame, Dot, DotX, DotY, GridX, GridY } from '$lib';

	let marginLeft = $state(30);
	let marginRight = $state(20);
	let marginTop = $state(5);
	let marginBottom = $state(20);

	const demoData = [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
		{ x: 2, y: 2 }
	];
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

marginLeft:<input type="range" bind:value={marginLeft} min={0} max={100} /><br />
marginRight: <input type="range" bind:value={marginRight} min={0} max={100} /><br />
marginTop: <input type="range" bind:value={marginTop} min={0} max={100} /><br />
marginBottom: <input type="range" bind:value={marginBottom} min={0} max={100} /><br />
<hr />
Figure Test:

<Figure {marginLeft} {marginRight} {marginBottom} {marginTop}>
	{#snippet header()}
		<h2>Figure with header</h2>
		<h3>and a subtitle</h3>
	{/snippet}
	<GridX />
	<GridY />
	<Frame />
	<Dot data={demoData} x="x" y="y" fill="red" />
	{#snippet footer()}
		<figcaption>and some words below</figcaption>
	{/snippet}
</Figure>

 
<div style="display:flex;">
	<div style="flex-grow: 1;max-width:50%">

		<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
			{#snippet header()}<h3 style="text-align:center">DotX</h3>{/snippet}
			<GridX /><GridY />
			<Frame />
			<DotX data={[-2, 1, 2, 3, 4,5,10]} fill="blue" />
		</Figure>

	</div>
	<div style="flex-grow: 1;max-width:50%">
	

		<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
			{#snippet footer()}<h3 style="text-align:center">DotY</h3>{/snippet}
			<GridX /><GridY />
			<Frame />
			<DotY data={[-2, 1, 2, 3, 4,5,10]} fill="blue" />
		</Figure>

	</div>
</div>



<b>Custom grid ticks</b>

<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
	<GridX data={[-3, 1, 2, 3, 4,5,10]} /><GridY data={[-1,2,3,4,6]}/>
	<DotX data={[-2, 1, 2, 3, 4,5,10]} r={3} />
</Figure>

Another one using [[x0,y0], [x1,y1], ...] coordinates:

<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
	<GridX />
	<GridY label="y" />
	<Frame />
	<Dot
		data={[
			[0, 10],
			[3, 11],
			[4, 9],
			[5, 9.6],
			[8, 12]
		]}
	/>
</Figure>  

<style>
	h3 {
		font-weight: 400;
		margin-bottom: 1ex;
	}
	:global(figcaption) {
		color: #999;
	}
</style>
