import { loadDatasets } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: await loadDatasets(['aapl', 'seattle', 'penguins', 'countries_2020'], fetch)
    };
};
