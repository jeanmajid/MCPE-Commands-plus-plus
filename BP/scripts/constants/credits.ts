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

interface Credit {
    role: string;
    names: string[];
}

export const CREDITS: Credit[] = [
    { role: "owner", names: ["jeanmajid"] },
    { role: "developers", names: ["MaxedOut4826", "conmaster2112"] },
    { role: "contributors", names: ["mediumcelly", "nikitschen", "mareczek1113", "OrangeCash090"] },
    { role: "quality assurance", names: ["pixelatedgamer0281"] },
];
