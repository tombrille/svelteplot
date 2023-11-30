<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import { getContext } from 'svelte';
	import BaseMark from './BaseMark.svelte';

	const figure = getContext<Figure>('svelteplot');
</script>

<BaseMark type="frame" data={[]} channels={[]}>
	<rect
		class="frame"
		x={figure.margins.left}
		y={figure.margins.top}
		width={figure.plotWidth}
		height={figure.plotHeight}
	/>
</BaseMark>

<!-- todo remove -->

<text
	style="font-size: 40px;text-anchor:middle"
	dominant-baseline="central"
	opacity={0.1}
	transform="translate({figure.margins.left + figure.plotWidth * 0.5}, {figure.margins.top +
		figure.plotHeight * 0.5})">{figure.plotWidth} x {figure.plotHeight}</text
>

<style>
	.frame {
		stroke: currentColor;
		fill: none;
	}
</style>
