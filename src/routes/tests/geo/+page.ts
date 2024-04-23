import { loadDatasets, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            world: await loadJSON(fetch, 'world-2019'),
            us: await loadJSON(fetch, 'us-states-10m'),
            ...(await loadDatasets(['bmi', 'presidents'], fetch))
        }
    };
};
