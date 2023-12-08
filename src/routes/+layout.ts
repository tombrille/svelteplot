import type { PageLoad } from './$types';
import { csvParse, autoType } from 'd3-dsv';

export const load: PageLoad = async ({ fetch }) => {
    const [aapl, cars, penguins, bls] = (
        await Promise.all([
            fetch(`/data/aapl.csv`),
            fetch(`/data/cars.csv`),
            fetch(`/data/penguins.csv`),
            fetch(`/data/bls.csv`)
        ])
    ).map(async (res) => csvParse(await res.text(), autoType));

    return { aapl, cars, penguins, bls };
};

export const ssr = false;
