/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
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
