import { loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            world: await loadJSON(fetch, 'countries-110m'),
            earthquakes: await loadJSON(fetch, 'earthquakes')
            // ...( await loadDatasets(['aapl', 'bls', 'crimea', 'riaa', 'driving', 'co2'], fetch))
        }
    };
};
