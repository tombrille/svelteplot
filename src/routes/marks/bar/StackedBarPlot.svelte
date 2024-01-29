<script lang="ts">
    import { Plot, BarX } from '$lib/fresh';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { rollups } from 'd3-array';

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
</script>

<Plot grid y={{}} x={{ nice: true, axis: 'top' }} marginLeft={70} marginTop={40}>
    <!-- <RuleY data={[0]} />  -->
    <BarX {data} y="island" x="count" fill="species" />
</Plot>
