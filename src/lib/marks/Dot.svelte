<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	// import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
	import resolveChannel from '$lib/helpers/resolveChannel';
	import type { BaseMarkProps, DotMarkProps } from '$lib/types';
	import { getContext } from 'svelte';
	import BaseMark from './BaseMark.svelte';
	import getBaseStyles from '$lib/helpers/getBaseStyles';

	const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

	const figure = getContext<Figure>('svelteplot');

	let { data, x = null, y = null, r = 5, ...styleProps } = $props<DotMarkProps>();
	// console.log({r,data}, figure.radius.domain, figure.radiusScale(resolveChannel('radius', data[0], r)))

</script>

<BaseMark_Dot type="dot" {data} channels={['x', 'y', 'radius']} {x} {y} {r} {...styleProps}>
	<g class="dots">
		{#each data as datum, i}
			<circle
				r={typeof r === 'number' ? r : figure.radiusScale(resolveChannel('radius', datum, r))}
				style={getBaseStyles(datum, styleProps)}
				transform="translate({[
					figure.xScale(resolveChannel('x', datum, x)),
					figure.yScale(resolveChannel('y', datum, y))
				]})"
			/>
		{/each}
	</g>
</BaseMark_Dot>
