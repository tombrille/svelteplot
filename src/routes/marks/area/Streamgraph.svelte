<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';
    import type { StackOffset } from '$lib/transforms/stack.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { riaa } = $derived(getData());

    let { stackControls } = $props<{ stackControls: boolean }>();

    let offset: StackOffset = $state('wiggle');
</script>

{#if stackControls}
    offset: <select bind:value={offset}>
        {#each ['none', 'wiggle', 'center', 'normalize'] as opt}
            <option>{opt}</option>
        {/each}
    </select>
{/if}

<Plot
    grid
    title="Hi"
    subtitle="This is a subtitle"
    caption="This is a note below"
    marginLeft={0}
    x={{ grid: true }}
    y={{ axis: false }}
    color={{ legend: true }}
    testid="area-y1"
>
    <AreaY data={riaa} x="year" y="revenue" z="format" fill="group" stack={{ offset }} />
</Plot>

TODO: y domain doesn't update when changing the offset
