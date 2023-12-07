<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import Line from './Line.svelte';

    let { data, ...rest } = $props<{ data: RawValue[] }>();
</script>

<Line
    data={data.map((value, index) => ({ value, index, ___orig___: value }))}
    x="value"
    y="index"
    {...rest}
/>
