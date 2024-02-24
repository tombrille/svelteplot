import { loadDatasets } from '$lib/helpers/csv.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: await loadDatasets(['aapl', 'bls', 'crimea', 'riaa', 'driving', 'co2'], fetch)
    };
};
