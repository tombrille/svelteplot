import { loadDatasets, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            us: await loadJSON(fetch, 'us-counties-10m'),
            europe: await loadJSON(fetch, 'europe'),
            ...(await loadDatasets(['wind', 'election', 'shifts'], fetch))
        }
    };
};
