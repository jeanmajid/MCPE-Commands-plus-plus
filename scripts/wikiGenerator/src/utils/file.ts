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

import { readdir } from "node:fs/promises";
import { join } from "node:path";

export async function* recursiveReadDir(base: string): AsyncGenerator<string> {
    for (const filePath of await readdir(base, { recursive: true, withFileTypes: true })) {
        if (filePath.isDirectory()) {
            continue;
        }

        yield join(filePath.parentPath, filePath.name);
    }
}
