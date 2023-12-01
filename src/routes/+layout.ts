import type { PageLoad } from './$types';
import { csvParse } from 'd3-dsv';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`/data/aapl.csv`);
    const aapl = csvParse(await res.text(), (d) => ({
        Date: new Date(d.Date),
        Open: +d.Open,
        Close: +d.Close,
        High: +d.High,
        Low: +d.Low,
        'Adj Close': +d['Adj Close']
    }));
    return { aapl };
};
