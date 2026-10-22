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

import { RGB, RGBA } from "@minecraft/server";

export function getNormalizedRGB(red: number, green: number, blue: number): RGB {
    return { red: red / 255, green: green / 255, blue: blue / 255 };
}

export function getNormalizedRGBA(red: number, green: number, blue: number, alpha: number): RGBA {
    return { red: red / 255, green: green / 255, blue: blue / 255, alpha: alpha / 255 };
}
