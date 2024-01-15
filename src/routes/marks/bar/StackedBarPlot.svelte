<script lang="ts">
    import type { Datasets } from '$lib/types.js';
    import { Plot, BarY, RuleY } from '$lib';
    import { getContext } from 'svelte';
    import { rollups } from 'd3-array';
    import { stackY } from '$lib/transforms/stack.js';

    const { penguins } = getContext<Datasets>('data');

    let data = $derived(
        rollups(
            penguins,
            (d) => d.length,
            (d) => d.species,
            (d) => d.island
        )
            .map(([species, group]) => group.map(([island, count]) => ({ species, island, count })))
            .flat(1)
    );

    $inspect(stackY(data, { x: 'island', y: 'count', fill: 'species' }));
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY {data} x="island" y="count" fill="species" />
</Plot>
or

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY {...stackY(data, { x: 'island', y: 'count', fill: 'species' })} />
</Plot>
