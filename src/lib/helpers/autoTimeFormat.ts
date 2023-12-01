import type { Channel } from '$lib/classes/Channel.svelte';
import dayjs from 'dayjs';

export default function autoTimeFormat(x: Channel, plotWidth: number) {
    const daysPer100Px = ((x.domain[1] - x.domain[0]) / plotWidth / 864e5) * 100;
    const format = daysPer100Px < 1 ? 'HH:mm\nMMM DD' : daysPer100Px < 30 ? 'DD\nMMM' : 'MMM\nYYYY';
    return (date: Date) => dayjs(date).format(format).split('\n');
}
