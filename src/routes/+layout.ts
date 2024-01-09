import type { PageLoad } from './$types';
import { csvParse, autoType } from 'd3-dsv';

export const load: PageLoad = async ({ fetch }) => {
    const [aapl, cars, penguins, bls, stateage] = await Promise.all(
        (
            await Promise.all([
                fetch(`/data/aapl.csv`),
                fetch(`/data/cars.csv`),
                fetch(`/data/penguins.csv`),
                fetch(`/data/bls.csv`),
                fetch(`/data/stateage2.csv`),
            ])
        ).map(async (res) => csvParse(await res.text(), autoType))
    );

    return { aapl, cars, penguins, bls, stateage };
};

export const ssr = false;
