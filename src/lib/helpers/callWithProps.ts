/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */

import type { RawValue } from '$lib/types.js';

type Setter = (v: any) => void;

export default function (
    d3func: () => Record<string, Setter>,
    args: RawValue[],
    props: Record<string, RawValue> = {}
) {
    const res = d3func(...args);
    for (const [key, val] of Object.entries(props)) {
        if (typeof res[key] !== 'function') throw new Error(`function ${key} does not exist`);
        res[key](val);
    }
    return res;
}
