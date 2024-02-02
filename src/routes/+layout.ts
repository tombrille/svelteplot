import type { PageLoad } from './$types';
import { csvParse, autoType } from 'd3-dsv';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
    const [aapl, alphabet, cars, penguins, bls, stateage, stocks, riaa] = await Promise.all(
        (
            await Promise.all([
                fetch(`/data/aapl.csv`),
                fetch(`/data/alphabet.csv`),
                fetch(`/data/cars.csv`),
                fetch(`/data/penguins.csv`),
                fetch(`/data/bls.csv`),
                fetch(`/data/stateage2.csv`),
                fetch(`/data/stocks.csv`),
                fetch(`/data/riaa.csv`)
            ])
        ).map(async (res) => csvParse(await res.text(), autoType))
    );

    return { aapl, alphabet, cars, penguins, bls, stateage, stocks, riaa };
};

export const ssr = false;
export const trailingSlash = 'never';
