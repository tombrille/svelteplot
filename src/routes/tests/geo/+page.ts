import { loadDatasets, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            world: await loadJSON(fetch, 'world-2019'),
            ...(await loadDatasets(['bmi'], fetch))
        }
    };
};
