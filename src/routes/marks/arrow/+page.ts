import { loadDatasets, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            europe: await loadJSON(fetch, 'europe'),
            ...(await loadDatasets(['metros', 'shifts'], fetch))
        }
    };
};
