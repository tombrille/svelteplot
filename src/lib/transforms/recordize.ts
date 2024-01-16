import isDataRecord from '$lib/helpers/isDataRecord.js';
import type { DataRow, TransformArg } from '$lib/types.js';

// This transform takes an array of raw values as input and returns
export function recordizeX({ data, ...channels }: TransformArg): TransformArg {
    const dataIsRawValueArray = !isDataRecord(data[0]);
    if (dataIsRawValueArray) {
        return {
            data: data.map((value, index) => ({
                __value: value,
                __index: index,
                ___orig___: value
            })) as DataRow[],
            ...channels,
            x: '__value',
            y: '__index'
        };
    }
    return { data, ...channels };
}

export function recordizeY({ data, ...channels }: TransformArg): TransformArg {
    if (!data) return { data, ...channels };
    const dataIsRawValueArray = !isDataRecord(data[0]);
    if (dataIsRawValueArray) {
        return {
            data: data.map((value, index) => ({
                __value: value,
                __index: index,
                ___orig___: value
            })) as DataRow[],
            ...channels,
            x: '__index',
            y: '__value'
        };
    }
    return { data, ...channels };
}
