/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import type { DataRecord } from '$lib/types.js';
import groupBy from 'underscore/modules/groupBy.js';

export function normalizeY({ data, y, y1, y2, stroke, fill, z, ...restProps }) {
    const groupBy = stroke || fill || z;
    const normalizedData = normalize(data, groupBy, ['y', 'y1', 'y2']);

    return {
        data: normalizedData,
        y,
        y1,
        y2,
        stroke,
        fill,
        z,
        ...restProps
    };
}

function normalize(data: DataRecord[], groupKey: string | null, props: string[]) {
    const filteredProps = props.filter((p) => data[0][p] != null);
    const groups = Object.values(groupBy(data, groupKey));
    return groups
        .map((data) =>
            data.map((datum) => ({
                ...datum,
                ...Object.fromEntries(
                    filteredProps.map((prop) => [prop, datum[prop] / data[0][prop]])
                )
            }))
        )
        .flat(1);
}
