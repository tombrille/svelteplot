import type { PageLoad } from './$types';
import { csvParse } from 'd3-dsv';

export const load: PageLoad = async ({ fetch }) => {
    const [aaplRes, carsRes] = await Promise.all([
        fetch(`/data/aapl.csv`),
        fetch(`/data/cars.csv`)
    ]);

    const aapl = csvParse(await aaplRes.text(), (d: Record<string, string>) => ({
        Date: new Date(d.Date),
        Open: +d.Open,
        Close: +d.Close,
        High: +d.High,
        Low: +d.Low,
        'Adj Close': +d['Adj Close']
    }));
    const cars = csvParse(await carsRes.text(), (d: Record<string, string>) =>
        Object.fromEntries(Object.entries(d).map(([k, v]) => [k, k === 'name' ? v : +v]))
    );
    return { aapl, cars };
};
