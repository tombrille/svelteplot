<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { riaa } = getContext<Datasets>('data');

    let { stackControls } = $props<{ stackControls: boolean }>();

    let offset = $state('wiggle');
</script>

{#if stackControls}
    offset: <select bind:value={offset}>
        {#each ['none', 'wiggle', 'center', 'normalize'] as opt}
            <option>{opt}</option>
        {/each}
    </select>
{/if}

<Plot marginLeft={0} y={{ axis: false }} color={{ legend: true }} testid="area-y1">
    <AreaY data={riaa} x="year" y="revenue" z="format" fill="group" stack={{ offset }} />
</Plot>

TODO: y domain doesn't update when changing the offset
