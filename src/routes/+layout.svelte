<script lang="ts">
	import type { Datasets } from '$lib/types';
	import { setContext } from 'svelte';

	const { data } = $props<Datasets>();

	setContext('data', data);
</script>

<svelte:head></svelte:head>

<slot />

<style>
	:root {
		--system-ui: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
			'Segoe UI Emoji', 'Segoe UI Symbol';
	}

	:global(body) {
		font-family: var(--system-ui);
	}
</style>
