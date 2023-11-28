<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
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

<GroupMultiple class="dots" {data}>
	{#each data as datum, i}
		<!-- todo: replace with <path> and symbols -->
		<circle
			r={resolveChannel('r', datum, r)}
			style:fill={resolveChannel('fill', datum, fill)}
			transform="translate({[
				figure.xScale(resolveChannel('x', datum, x)),
				figure.yScale(resolveChannel('y', datum, y))
			]})"
		/>
	{/each}
</GroupMultiple>