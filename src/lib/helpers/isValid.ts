/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import type { RawValue } from '../types.js';

/**
 * @deprecated import from helpers/index.ts instead!
 * @param value
 * @returns
 */
export function isValid(value: RawValue): value is number | Date | string {
    return value !== null && !Number.isNaN(value);
}
