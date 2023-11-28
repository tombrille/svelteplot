<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import resolveChannel from '$lib/helpers/resolveChannel';
	import type { DataRow } from '$lib/types';
	import { getContext } from 'svelte';

	const figure = getContext<Figure>('svelteplot');

	let {
		data,
		x = null,
		y = null,
		fill = null,
		r = 5
	} = $props<{ data: DataRow[]; x: string; y: string; fill: string; r: string }>();

	figure.addMark({
		type: 'dot',
		channels: new Set(['x', 'y', 'r']),
		props: { data, x, y, fill, r }
	});
</script>

{#each data as datum, i}
	<circle
		r={resolveChannel('r', datum, r)}
		style:fill={resolveChannel('fill', datum, fill)}
		transform="translate({[
			figure.xScale(resolveChannel('x', datum, x)),
			figure.yScale(resolveChannel('y', datum, y))
		]})"
	/>
{/each}
