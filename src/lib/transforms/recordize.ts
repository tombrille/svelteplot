import isDataRecord from '$lib/helpers/isDataRecord.js';
import type { ChannelAccessor, DataRecord, DataRow, TransformArg } from '$lib/types.js';

/*
 * This transform takes an array of raw values as input and returns data records
 * in which the values are interpreted as x channel and their index as y
 */
export function recordizeX<T>(
    { data, ...channels }: TransformArg<T, DataRow>,
    { withIndex } = { withIndex: true }
): TransformArg<T & { x: ChannelAccessor; y: ChannelAccessor }, DataRecord> {
    const dataIsRawValueArray =
        !isDataRecord(data[0]) && !Array.isArray(data[0]) && channels.x == null;
    if (dataIsRawValueArray) {
        return {
            data: data.map((value, index) => ({
                __value: value,
                ...(withIndex ? { __index: index } : {}),
                ___orig___: value
            })) as DataRow[],
            ...channels,
            x: '__value',
            ...(withIndex ? { y: '__index' } : {})
        };
    }
    return { data, ...channels };
}

/*
 * This transform takes an array of raw values as input and returns data records
 * in which the values are interpreted as y channel and their index as yx
 */
export function recordizeY<T>(
    { data, ...channels }: TransformArg<T, DataRow>,
    { withIndex } = { withIndex: true }
): TransformArg<T, DataRecord> {
    if (!data) return { data, ...channels };
    const dataIsRawValueArray =
        !isDataRecord(data[0]) && !Array.isArray(data[0]) && channels.y == null;
    if (dataIsRawValueArray) {
        return {
            data: data.map((value, index) => ({
                __value: value,
                ...(withIndex ? { __index: index } : {}),
                ___orig___: value
            })) as DataRow[],
            ...channels,
            ...(withIndex ? { x: '__index' } : {}),
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
