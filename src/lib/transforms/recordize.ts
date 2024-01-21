import isDataRecord from '$lib/helpers/isDataRecord.js';
import type { DataRecord, DataRow, TransformArg } from '$lib/types.js';

// This transform takes an array of raw values as input and returns
export function recordizeX({ data, ...channels }: TransformArg): TransformArg {
    const dataIsRawValueArray = !isDataRecord(data[0]) && !Array.isArray(data[0]);
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
    const dataIsRawValueArray = !isDataRecord(data[0]) && !Array.isArray(data[0]);
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

/**
 * This transform is used to allow users to pass an [[x0, y0], [x1, y1], ...] array
 * as dataset to marks that support it. It transforms the arrays into records, so
 * the rest of our code doesn't have to deal with this case anymore.
 */
export function recordizeXY({ data, ...channels }: TransformArg): TransformArg {
    if (!data) return { data, ...channels };
    if (
        !isDataRecord(data[0]) &&
        Array.isArray(data[0]) &&
        channels.x === undefined &&
        channels.y === undefined
    ) {
        return {
            data: (data as [number, number][]).map(([x, y, ...rest]) => ({
                ___orig___: [x, y, ...rest],
                __x: x,
                __y: y
            })) as DataRecord[],
            ...channels,
            x: '__x',
            y: '__y'
        };
    }
    return { data, ...channels };
}
