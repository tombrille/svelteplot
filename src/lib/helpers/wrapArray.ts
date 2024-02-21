import type { DataRow } from '$lib/types.js';
import isObject from 'underscore/modules/isObject.js';

export default function (data: DataRow[]) {
    return data.map((d) => (isObject(d) ? d : { value: d }));
}
