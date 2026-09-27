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

export interface DurationReturn {
    message?: string;
    value?: number | null;
}

export function parseDurationString(durationString: string): DurationReturn {
    if (!durationString) {
        return { message: "§cInput cannot be empty" };
    }

    if (durationString.startsWith("perm")) {
        return { value: null };
    }

    const formatRegex = /^(\d+[ymdhYMDH]:)*\d+[ymdhYMDH]$/;
    if (!formatRegex.test(durationString)) {
        return { message: '§cInvalid duration format. Use the format like "1y:2m:3d:4h"' };
    }

    const durationArray = durationString.split(":");
    let durationMs = 0;

    for (const timeUnit of durationArray) {
        const unit = timeUnit.charAt(timeUnit.length - 1).toLowerCase();
        const value = parseInt(timeUnit.slice(0, -1), 10);

        if (isNaN(value) || value < 0) {
            return { message: `§cInvalid numeric value: ${timeUnit}` };
        }

        switch (unit) {
            case "y":
                durationMs += value * 365 * 24 * 60 * 60 * 1000;
                break;
            case "d":
                durationMs += value * 24 * 60 * 60 * 1000;
                break;
            case "h":
                durationMs += value * 60 * 60 * 1000;
                break;
            case "m":
                durationMs += value * 60 * 1000;
                break;
            default:
                return { message: `§cInvalid time unit: ${unit}` };
        }
    }

    const maxDuration = 100 * 365 * 24 * 60 * 60 * 1000;
    if (durationMs > maxDuration) {
        return { message: "§cTotal duration exceeds the maximum allowed (100 years)" };
    }

    const futureDate = new Date(Date.now() + durationMs);
    return { value: futureDate.valueOf() };
}
