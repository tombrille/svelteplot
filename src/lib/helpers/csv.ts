import { csvParse, autoType } from 'd3-dsv';

async function loadCSV(fetch, dataset: string) {
    const res = await fetch(`/data/${dataset}.csv`);
    const text = await res.text();
    return csvParse(text, autoType);
}

/**
 * helper function used in the SveltePlot docs to load example datasets
 */
export async function loadDatasets(ids: string[], fetch) {
    return Object.fromEntries(
        (await Promise.all(ids.map((id) => loadCSV(fetch, id)))).map((data, i) => [ids[i], data])
    );
}
