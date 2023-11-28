<script lang="ts">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
	import type { DataRow, DataRecord } from '$lib/types';
	import { getContext } from 'svelte';

	const figure = getContext<Figure>('svelteplot');

	let {
		data = [],
		label = null,
		tickFormat = (d) => String(d)
	} = $props<{
		data: DataRow[];
		tickFormat: (d: DataRecord) => string;
		fill: string;
		label: string;
	}>();

	figure.addMark({
		type: 'grid-y',
		channels: new Set(data.length ? ['y'] : []),
		props: { data }
	});

	let ticks = $derived(data.length > 0 ? data : figure.yScale.ticks(Math.ceil(figure.plotHeight / 60)));
</script>

<GroupMultiple data={ticks} class="grid-y">
	{#if label}
		<text x={0} y={5} class="grid-label" dominant-baseline="hanging">{label}</text>
	{/if}
	{#each ticks as tick}
		<g class="y-tick" transform="translate({figure.margins.left},{figure.yScale(tick)})">
			<text x="-7" dominant-baseline="middle">{tickFormat(tick)}</text>
			<line x2="-5" />
			<line class="grid" x2={figure.width - figure.margins.right - figure.margins.left} />
		</g>
	{/each}
</GroupMultiple>

<style>
	text {
		text-anchor: end;
		font-size: 11px;
		fill: #4a4a4a;
	}
	text.grid-label {
		text-anchor: start;
	}
	.y-tick line {
		stroke: currentColor;
	}
	.y-tick line.grid {
		stroke: #d9d9d9;
	}
</style>
