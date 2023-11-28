<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
	import type { DataRow, DataRecord } from '$lib/types';
	import { getContext } from 'svelte';

	const figure = getContext<Figure>('svelteplot');

	let { data = [], tickFormat = (d) => String(d) } = $props<{
		data: DataRow[];
		tickFormat: (d: DataRecord) => string;
		fill: string;
	}>();

	figure.addMark({
		type: 'grid-x',
		channels: new Set(data.length ? ['x'] : []),
		props: { data }
	});

	let ticks = $derived(data.length ? data : figure.xScale.ticks(Math.ceil(figure.plotWidth / 60)));
	let tickTexts = $derived(ticks.map(tickFormat));

    $effect(() => console.log(figure.xScale(1.5)))
</script>

<GroupMultiple data={ticks} class="grid-x">
    <text>{ticks.length}</text>
	{#each ticks as tick, t}
		{@const textLines = tickTexts[t]}
		{@const prevTextLines = t && tickTexts[t - 1]}
		<g class="x-tick" transform="translate({figure.xScale(tick)},{figure.margins.top})">
			<line class="grid" y2={figure.height - figure.margins.top - figure.margins.bottom} />
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
</GroupMultiple>

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
