<script module>
    export let title = 'Bubble matrix';
</script>

<script lang="ts">
    import { Plot, Dot, group } from 'svelteplot';
    import { page } from '$app/state';
    import type { ExamplesData } from '../types';
    let { penguins } = $derived(
        page.data.data
    ) as ExamplesData;
</script>

<Plot
    marginLeft={60}
    height={240}
    grid
    color={{ legend: true }}
    x={{ sort: true }}
    r={{ range: [0, 40] }}>
    <Dot
        {...group(
            {
                data: penguins,
                x: 'species',
                y: 'island',
                stroke: 'sex'
            },
            { r: 'count' }
        )} />
</Plot>
