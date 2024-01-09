<script lang="ts">
    import { Plot, RuleX, TickX } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { range } from 'd3-array';
    import { getContext } from 'svelte';
    import { uniq } from 'underscore';

    const { stateage } = getContext<Datasets>('data');

    type StateAge = (typeof stateage)[0];

    let padding = $state(0.3);
    let align = $state(0.5);
</script>

<div class="content">
    <h1>Ticks</h1>

    <Plot
        y={{ label: '↑ Age (years)', domain: uniq(stateage.map((d) => d.age)) }}
        x={{ grid: true, label: 'Population (%) →', percent: true }}
        marginLeft={50}
    >
        <RuleX data={[0]} />
        <TickX data={stateage} y="age" x="pop_share" />
    </Plot>

    <p>You can set the padding:</p>

    padding:<input type="range" min={0} max={1} step={0.01} bind:value={padding} />
    {padding}
    align: <input type="range" min={0} max={1} step={0.01} bind:value={align} />
    {align}

    <Plot
        y={{ label: '↑ Age (years)', domain: uniq(stateage.map((d) => d.age)), padding, align }}
        x={{ grid: true, label: 'Population (%) →', percent: true }}
        marginLeft={50}
    >
        <RuleX data={[0]} />
        <TickX data={stateage} y="age" x="pop_share" />
    </Plot>
</div>
