<script lang="ts">
    import { Plot, LineY, Dot } from '$lib/index.js';

    import type { Curve } from '$lib/types.js';
    import Code from '../../Code.svelte';

    // curve demo
    const numbers = [
        0.25, 0.09, 0.58, 0.22, 0.38, 0.03, 0.45, 0.12, 0.87, 0.99, 0.85, 0.5, 0.64, 0.86, 0.6,
        0.09, 0.14, 0.95, 0.92, 0.89
    ];
    let curve: Curve = $state('catmull-rom');
    let tension: number = $state(0.5);
    const CURVES =
        'basis,basis-open,basis-closed,bump-x,bump-y,bundle,cardinal,cardinal-open,cardinal-closed,catmull-rom,catmull-rom-open,catmull-rom-closed,linear,linear-closed,monotone-x,monotone-y,natural,step,step-after,step-before'.split(
            ','
        );
</script>

<div class="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-between">
    <div>
        curve: <select bind:value={curve}>
            {#each CURVES as c}<option>{c}</option>{/each}
        </select>
    </div>
    <div>
        {#if curve.includes('bundle') || curve.includes('catmull') || curve.includes('cardinal')}
            tension: <input type="range" bind:value={tension} min={0} max={2} step={0.1} />
            ({tension})
        {/if}
    </div>
</div>

<Plot grid>
    <LineY data={numbers} {curve} {tension} />
    <!-- TODO: use DotY here -->
    <Dot data={numbers.map((d, i) => ({ value: d, index: i }))} y="value" x="index" />
</Plot>

<Code code={`<Plot grid>
    <LineY data={numbers} {curve} {tension} />
    <Dot data={numbers.map((d, i) => ({ value: d, index: i }))} y="value" x="index" />
</Plot>`} />
