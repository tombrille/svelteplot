import { loadDatasets, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: {
            world: await loadJSON(fetch, 'countries-110m'),
            ...(await loadDatasets(
                [
                    'aapl',
                    'beagle',
                    'bls',
                    'co2',
                    'crimea',
                    'driving',
                    'riaa',
                    'stateage',
                    'tdf',
                    'rightwing',
                    'stocks',
                    'sftemp'
                ],
                fetch
            ))
        }
    };
};
