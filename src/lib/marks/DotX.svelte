<script lang="ts">
    import type { RawValue } from '$lib/types';
    import Dot from './Dot.svelte';

    let { data, ...rest } = $props<{ data: RawValue[] }>();
</script>

<Dot
    data={data.map((value, index) => ({ value, index, ___orig___: value }))}
    x="value"
    y="index"
    {...rest}
/>
