import { resolveProp } from "$lib/helpers/resolve.js";
import type { DataRecord, TransformArg } from "$lib/types.js";
import { geoCentroid as d3GeoCentroid } from "d3-geo";

export function geoCentroid({ data, ...options}: TransformArg<DataRecord>) {
    return {
        data: data.map((d) => ({
            ...d, 
            __centroid__: d3GeoCentroid(resolveProp(options.geometry, d, d))
        })),
        ...options,
        x: d => d.__centroid__[0],
        y: d => d.__centroid__[1],
    };
}