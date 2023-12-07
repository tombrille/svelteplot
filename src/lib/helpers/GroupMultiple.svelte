<script lang="ts">
    import type { DataRow } from '$lib/types.js';

    let { data = [], ...rest } = $props<{ data: DataRow[] }>();
</script>

{#if data.length !== 1}
    <g {...rest}><slot /></g>
{:else}
    <slot />
{/if}
