import { loadJSON, loadDatasets } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            us: await loadJSON(fetch, 'us-counties-10m'),
            world: await loadJSON(fetch, 'countries-110m'),
            earthquakes: await loadJSON(fetch, 'earthquakes'),
            ...(await loadDatasets(['unemployment', 'presidents'], fetch))
        }
    };
};
