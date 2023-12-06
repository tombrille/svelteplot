import type { PageLoad } from './$types';
import { csvParse, autoType } from 'd3-dsv';

export const load: PageLoad = async ({ fetch }) => {
    const [aapl, cars, penguins] = (
        await Promise.all([
            fetch(`/data/aapl.csv`),
            fetch(`/data/cars.csv`),
            fetch(`/data/penguins.csv`)
        ])
    ).map(async (res) => csvParse(await res.text(), autoType));

    return { aapl, cars, penguins };
};

export const ssr = false;
