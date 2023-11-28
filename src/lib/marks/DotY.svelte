<script lang="ts">
	import type { RawValue } from '$lib/types';
	import Dot from './Dot.svelte';

	let { data, ...rest } = $props<{ data: RawValue[] }>();
</script>

<Dot data={data.map((value, index) => ({ value, index }))} x="index" y="value" {...rest} />
