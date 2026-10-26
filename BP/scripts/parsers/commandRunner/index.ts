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

import "./commandRunner.js";
import "./registry/name.js";
import { CommandRunner } from "./commandRunner.js";
const now = Date.now();

// CommandRunner.run("test {@s.score.{@s.name}}");
CommandRunner.run("test {@s.score.objective}  {@s.score.{@s.name}}");

console.log(`time: ${Date.now() - now}ms`);

// {@s.block_from_view_direction}
// {@s.score.objective}
// {var.VARIABLENAME}
