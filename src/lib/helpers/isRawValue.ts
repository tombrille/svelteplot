import type { RawValue } from '$lib/types.js';
import { isDate } from '$lib/helpers/typeChecks';

export default function (value: any): value is RawValue {
    const t = typeof value;
    return t === 'string' || t === 'number' || t === 'boolean' || isDate(value) || t === null;
}
