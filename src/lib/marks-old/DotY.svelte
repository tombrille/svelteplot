<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import Dot from './Dot.svelte';

    let { data, ...rest } = $props<{ data: RawValue[] }>();
</script>

<Dot {data} y={(d) => d} x={0} {...rest} />
