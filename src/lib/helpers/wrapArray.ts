import type { DataRow } from '$lib/types';
import { isObject } from 'underscore';

export default function (data: DataRow[]) {
	return data.map((d) => (isObject(d) ? d : { value: d }));
}
