import { groupFacetsAndZ } from '$lib/helpers/group.js';
import { testFilter } from '$lib/helpers/index.js';
import { reduceOutputs, type ReducerName } from '$lib/helpers/reduce.js';
import { resolveChannel } from '$lib/helpers/resolve.js';
import type { DataRecord, DataRow, RawValue, TransformArg } from '$lib/types.js';
import { groups as d3Groups } from 'd3-array';

type ReducerFunc = (group: DataRow[]) => RawValue;
type ReducerOption = ReducerName | ReducerFunc;

type AdditionalOutputChannels = Partial<{
    fill: ReducerOption;
    stroke: ReducerOption;
    r: ReducerOption;
    opacity: ReducerOption;
    fillOpacity: ReducerOption;
    strokeOpacity: ReducerOption;
}>;

type GroupBaseOptions = {
    domain?: [number, number];
    thresholds?: NamedThresholdsGenerator | number | number[] | ThresholdCountGenerator;
    interval?: number | string;
    cumulative?: false | 1 | -1;
    reverse?: boolean;
};

type GroupXOptions = GroupBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        y: ReducerOption;
        y1: ReducerOption;
        y2: ReducerOption;
    }>;

type GroupYOptions = GroupBaseOptions &
    AdditionalOutputChannels &
    Partial<{
        x: ReducerOption;
        x1: ReducerOption;
        x2: ReducerOption;
    }>;

type GroupZOptions = GroupXOptions | GroupYOptions;

export function group() {}

export function groupX(input: TransformArg<T, DataRecord>, options: GroupXOptions = {}) {
    return groupXYZ('x', input, options);
}

export function groupY(input: TransformArg<T, DataRecord>, options: GroupYOptions = {}) {
    return groupXYZ('y', input, options);
}
export function groupZ(input: TransformArg<T, DataRecord>, options: GroupZOptions = {}) {
    return groupXYZ('z', input, options);
}

function groupXYZ(
    dim: 'x' | 'y' | 'z',
    { data, ...channels }: TransformArg<T, DataRecord>,
    options: GroupXOptions = {}
) {
    // group by x or y
    const groups =
        dim === 'z'
            ? [[null, data]]
            : d3Groups(
                  data.filter((d) => testFilter(d, channels)),
                  (d) => resolveChannel(dim, d, channels)
              );
    const newData: DataRecord[] = [];
    let newChannels = { ...channels, filter: null };
    if (dim !== 'z') newChannels[dim] = `__${dim}`;

    const outputs = [
        ...(dim === 'x'
            ? ['y', 'y1', 'y2']
            : dim === 'y'
              ? ['x', 'x1', 'x2']
              : ['x', 'x1', 'x2', 'y', 'y1', 'y2']),
        'fill',
        'stroke',
        'r',
        'opacity',
        'fillOpacity',
        'strokeOpacity'
    ];

    groups.forEach(([groupKey, items]) => {
        const baseRecord = dim === 'z' ? {} : { [`__${dim}`]: groupKey };
        const newGroupChannels = groupFacetsAndZ(items, channels, (items, itemGroupProps) => {
            const item = { ...baseRecord, ...itemGroupProps };
            reduceOutputs(item, items, options, outputs, channels, newChannels);
            newData.push(item);
        });
        newChannels = { ...newChannels, ...newGroupChannels };
    });
    return { data: newData, ...newChannels };
}
