<script lang="ts">
    import '../app.scss';
    // pre-load shared datasets
    import { setContext } from 'svelte';
    import { csv } from 'd3-fetch';
    import { autoType } from 'd3-dsv';
    import { page } from '$app/stores';
    import type { DataRecord } from '$lib/types.js';
    import { isEqual } from 'underscore';

    const allDatasets = [
        'aapl',
        'alphabet',
        'bls',
        'cars',
        'crimea',
        'metros',
        'olympians',
        'penguins',
        'riaa',
        'seattle',
        'stateage',
        'stocks'
    ];

    let datasetIds = $derived($page.data.datasets || []);
    let datasets: null | Record<string, DataRecord[]> = $state(
        Object.fromEntries(allDatasets.map((id) => [id, []]))
    );

    let prevDatasetIds: string[] = [];

    let allLoaded = $derived(!datasetIds.length || datasetIds.every((id) => datasets[id].length));

    $effect(async () => {
        if (!isEqual(datasetIds, prevDatasetIds)) {
            prevDatasetIds = datasetIds.slice(0);

            // now load the actual datasets
            datasets = {
                ...datasets,
                ...Object.fromEntries(
                    await Promise.all(
                        datasetIds
                            .filter((id) => !datasets[id].length)
                            .map((id) => {
                                return new Promise((resolve) => {
                                    csv(`/data/${id}.csv`, autoType).then((data) => {
                                        resolve([id, data]);
                                    });
                                });
                            })
                    )
                )
            };
        }
    });
    setContext('data', () => datasets);
</script>

{#if allLoaded}
    <slot />
{/if}
