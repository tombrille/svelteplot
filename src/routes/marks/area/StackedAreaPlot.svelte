<script lang="ts">
    import { Plot, AreaY } from '$lib/index.js';
    import { page } from '$app/stores';
    import { Select, Slider } from '$lib/ui/index.js';
    import type { CurveName } from '$lib/types.js';
    let { riaa } = $derived($page.data.data);

    let { stackControls }: { stackControls: boolean } = $props();

    const CURVES =
        'basis,basis-open,basis-closed,bump-x,bump-y,bundle,cardinal,cardinal-open,cardinal-closed,catmull-rom,catmull-rom-open,catmull-rom-closed,linear,linear-closed,monotone-x,monotone-y,natural,step,step-after,step-before'.split(
            ','
        );
    let curve: CurveName = $state('linear');

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
    <Select label="curve" bind:value={curve} options={CURVES} />
{/if}

<Plot color={{ legend: true }} testid="area-y1" caption="Source: RIAA">
    <AreaY
        data={riaa}
        x="year"
        y="revenue"
        z="format"
        fill="group"
        href="/marks/line"
        {curve}
        stack={{ order, reverse }} />
</Plot>
