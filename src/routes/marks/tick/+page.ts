import { loadDatasets } from '$lib/helpers/index.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: await loadDatasets(['stateage'], fetch)
    };
};
