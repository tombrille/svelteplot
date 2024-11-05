import type { Scale } from '$lib/classes/Scale.svelte.js';
import { isDate } from '$lib/helpers/typeChecks';

const DATE_TIME = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    day: 'numeric'
});
const autoFormatDateTime = (date: Date) => DATE_TIME.format(date).replace(', ', '\n');

const DAY_MONTH = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
})
const autoFormatDayMonth = (date: Date) => DAY_MONTH.format(date).replace(' ', '\n');

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric'
});
const autoFormatMonthYear = (date: Date) => MONTH_YEAR.format(date).replace(' ', '\n');

export default function autoTimeFormat(x: Scale, plotWidth: number) {
    const daysPer100Px =
        ((toNumber(x.domain[1]) - toNumber(x.domain[0])) / plotWidth / 864e5) * 100;
    const format = daysPer100Px < 1 ? autoFormatDateTime : daysPer100Px < 30 ? autoFormatDayMonth : autoFormatMonthYear;
    return (date: Date) => format(date).split('\n');
}

function toNumber(d: Date | string | number) {
    return isDate(d) ? d.getTime() : +d;
}
