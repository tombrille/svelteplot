import type { Channel } from '$lib/classes/Channel.svelte';
import dayjs from 'dayjs';
import { isDate } from 'underscore';

export default function autoTimeFormat(x: Channel, plotWidth: number) {
    const daysPer100Px =
        ((toNumber(x.domain[1]) - toNumber(x.domain[0])) / plotWidth / 864e5) * 100;
    const format = daysPer100Px < 1 ? 'HH:mm\nMMM DD' : daysPer100Px < 30 ? 'DD\nMMM' : 'MMM\nYYYY';
    return (date: Date) => dayjs(date).format(format).split('\n');
}

function toNumber(d: Date | string | number) {
    return isDate(d) ? d.getTime() : +d;
}
