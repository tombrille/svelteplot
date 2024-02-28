import { groupFacetsAndZ } from '$lib/helpers/group.js';

/**
 * Keeps only the first item of each group
 */
export function first({ data, ...channels }) {
    const newData = [];
    groupFacetsAndZ(data, channels, (items) => {
        newData.push(items[0]);
    });
    return { data: newData, ...channels };
}

/**
 * Keeps only the last item of each group
 */
export function last({ data, ...channels }) {
    const newData = [];
    groupFacetsAndZ(data, channels, (items) => {
        newData.push(items.at(-1));
    });
    return { data: newData, ...channels };
}
