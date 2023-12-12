import type { RawValue } from '$lib/types.js';

export default function (values: RawValue[]) {
    const arr = values.map((value, index) => ({ value, index, ___orig___: value }));
    arr.__wrapped__ = true;
    return arr;
}
