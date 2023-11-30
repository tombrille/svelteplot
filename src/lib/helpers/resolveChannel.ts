import isDataRecord from '$lib/helpers/isDataRecord';
import type { ChannelName, ChannelAccessor, DataRow, RawValue } from '../types';

export default function (
	channel: ChannelName,
	datum: DataRow,
	accessor: ChannelAccessor = null
): RawValue {
	if ((channel === 'x' || channel === 'y') && Array.isArray(datum) && accessor === null) {
		// special case for [[x0,y0], [x1,y1], ...] format
		return datum[channel === 'x' ? 0 : 1];
	} else if (isDataRecord(datum)) {
		// use accessor function
		if (typeof accessor === 'function') return accessor(datum);
		// use accessor string
		if (typeof accessor === 'string' && datum[accessor] !== undefined) return datum[accessor];
		// fallback to channel name as accessor
		if (accessor === null && datum[channel] !== undefined) return datum[channel];
		// interpret accessor as constant
		return accessor;
	} else {
		// return single value or accessor
		return typeof accessor === 'function'
			? accessor(datum, index)
			: accessor !== null && Array.isArray(datum)
			  ? accessor
			  : datum;
	}
}
