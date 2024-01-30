<script lang="ts">
    import { Plot, AreaY } from '$lib/fresh/index.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { riaa } = getContext<Datasets>('data');

    let { stackControls } = $props<{ stackControls: boolean }>();

    let reverse = $state(false);
    let order = $state('none');
</script>

{#if stackControls}
    order: <select bind:value={order}>
        {#each ['none', 'appearance', 'inside-out', 'sum'] as opt}
            <option>{opt}</option>
        {/each}
    </select>
    <label><input type="checkbox" bind:checked={reverse} /> reverse?</label>
{/if}

<Plot color={{ legend: true }} testid="area-y1">
    <AreaY data={riaa} x="year" y="revenue" z="format" fill="group" stack={{ order, reverse }} />
</Plot>
