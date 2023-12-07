<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import Dot from './Dot.svelte';

    let { data, ...rest } = $props<{ data: RawValue[] }>();
</script>

<Dot {data} x={(d) => d} y={0} {...rest} />
