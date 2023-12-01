<script lang="ts">
	import { setContext } from 'svelte';
	import type { Margins, FigureProps } from './types';
	import { Figure } from './classes/Figure.svelte';

	let {
		// snippets
		header,
		footer,
		children,
		// props
		height = 400,
		marginLeft = 30,
		marginRight = 10,
		marginTop = 10,
		marginBottom = 30,
		// scales
		radius,
		y
	} = $props<FigureProps>();

	let width = $state(400);

	const figure = new Figure(600, 400, {
		marginTop,
		marginLeft,
		marginRight,
		marginBottom,
		radius,
		y
	});

	setContext('svelteplot', figure);

	$effect(() => {
		figure.width = width;
		figure.height = height;
		figure.options = { marginBottom, marginLeft, marginRight, marginTop, radius, y };
	});
</script>

<figure class="svelteplot" bind:clientWidth={width}>
	{#if header}{@render header()}{/if}
	{#if children}
		<svg {width} {height}>
			<slot {figure} />
		</svg>
	{/if}
	{#if footer}{@render footer()}{/if}
</figure>

<style>
	figure {
		margin: 1em 0;
	}
	svg {
		overflow: visible;
	}
	.svelteplot :global(h2),
	.svelteplot :global(h3) {
		margin: 0 0 0.5ex;
	}
</style>
