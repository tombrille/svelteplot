<script lang="ts" context="module">
	import type { BaseMarkProps } from '$lib/types';
</script>

<script lang="ts" generics="T extends BaseMarkProps">
	import type { Figure } from '$lib/classes/Figure.svelte';
	import { Mark } from '$lib/classes/Mark.svelte';
	import { getContext } from 'svelte';

	const figure = getContext<Figure>('svelteplot');

	type Foo = { children?: Function };

	let { type, data = [], channels = [], children, ...rest } = $props<T & Foo>();

	const mark = new Mark(type, channels, { data, ...rest });
	// console.log(type, { data, rest });
	figure.addMark(mark);

	$effect(() => {
		// update mark channels
		mark.channels = new Set(channels);
	});

	$effect(() => {
		// update mark channels
		mark.props = { data, ...rest };
	});

	$effect(() => {
		return () => {
			// remove mark from figure
			figure.removeMark(mark);
		};
	});
</script>

<slot />
