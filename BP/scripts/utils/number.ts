/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import { MAX_SIGNED_INT32, MIN_SIGNED_INT32 } from "../constants/integer.js";

export function numberInRange(value: number, min: number, max: number): boolean {
    return value <= min && max >= value;
}

export class Random {
    public static number01(): number {
        return Math.random();
    }

    public static intRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static floatRange(min: number, max: number): number {
        return Math.random() * (max - min + 1) + min;
    }

    public static signedInt32(min?: number, max?: number): number {
        if (min === undefined || min < MIN_SIGNED_INT32) {
            min = MIN_SIGNED_INT32;
        }

        if (max === undefined || max > MAX_SIGNED_INT32) {
            max = MAX_SIGNED_INT32;
        }

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static arrayElement<T extends string | unknown[]>(array: T): T[number] {
        return array[Math.floor(Math.random() * array.length)];
    }

    public static keyValuePair<T>(record: Record<string, T>): [string, T] {
        const entries = Object.entries(record);
        const randomIndex = Math.floor(Math.random() * entries.length);
        const entry = entries[randomIndex];
        return [entry[0], entry[1]];
    }

    public static async importFromDir(
        path: string,
        contentsCount: number
    ): Promise<Record<string, string[]>> {
        return await import(path + Random.intRange(0, contentsCount));
    }
}
