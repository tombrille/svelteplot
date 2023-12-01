<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
	import type { DataRow, BaseMarkProps, GridXMarkProps, GridOptions, RawValue } from '$lib/types';
	import { getContext } from 'svelte';
	import BaseMark from './BaseMark.svelte';
	import resolveChannel from '$lib/helpers/resolveChannel';
	import getBaseStyles from '$lib/helpers/getBaseStyles';
	import removeIdenticalLines from '$lib/helpers/removeIdenticalLines';
	import autoTimeFormat from '$lib/helpers/autoTimeFormat';
	import dayjs from 'dayjs';

	const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

	const figure = getContext<Figure>('svelteplot');

	let {
		data = [],
		tickFormat = null,
		y1 = null,
		y2 = null,
		title = null,
		...styleProps
	} = $props<GridXMarkProps & GridOptions>();

	let ticks = $derived(data.length ? data : figure.xScale.ticks(Math.ceil(figure.plotWidth / 60)));

	let useTickFormat = $derived(
		typeof tickFormat === 'function'
			? tickFormat
			: figure.x.scaleType === 'time'
			  ? typeof tickFormat === 'string'
					? (d: Date) => dayjs(d).format(tickFormat as string).split('\n')
					: autoTimeFormat(figure.x, figure.plotWidth)
			  :  (d: RawValue) => String(d)
	);

	let tickTexts = $derived(removeIdenticalLines(ticks.map(useTickFormat)));
</script>

<BaseMark_GridX type="grid-x" {data} channels={data.length ? ['x'] : []} {y1} {y2}>
	<g class="grid-x">
		{#if title}
			<text x={0} y={5} class="grid-title" dominant-baseline="hanging">{title}</text>
		{/if}
		{#each ticks as tick, t}
			{@const textLines = tickTexts[t]}
			{@const prevTextLines = t && tickTexts[t - 1]}
			<g class="x-tick" transform="translate({figure.xScale(tick)},{figure.margins.top})">
				<line
					class="grid"
					style={getBaseStyles(tick, styleProps)}
					y1={y1 ? figure.yScale(resolveChannel('y', tick, y1)) : 0}
					y2={y2
						? figure.yScale(resolveChannel('y', tick, y2))
						: figure.height - figure.margins.top - figure.margins.bottom}
				/>
				<g transform="translate(0,{figure.height - figure.margins.top - figure.margins.bottom})">
					<text y={5} dominant-baseline="hanging">
						{#if typeof textLines === 'string' || textLines.length === 1}
							{textLines}
						{:else}
							{#each textLines as line, i}
								<tspan x="0" dy={i ? 12 : 0}
									>{!prevTextLines || prevTextLines[i] !== line ? line : ''}</tspan
								>
							{/each}
						{/if}
					</text>
					<line y2="-5" />
				</g>
			</g>
		{/each}
	</g>
</BaseMark_GridX>

<style>
	.x-tick text {
		text-anchor: middle;
		font-size: 11px;

		fill: #4a4a4a;
	}
	.x-tick line {
		stroke: currentColor;
	}
	.x-tick line.grid {
		stroke: #d9d9d9;
	}
</style>
