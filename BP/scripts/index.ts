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

import { world } from "@minecraft/server";

import { AttributeManager } from "./attributes/attribute.js";
import "./attributes/index.js";
import "./commands/index.js";
import "./enums/index.js";
import { GameRuleManager } from "./gameRules/gameRule.js";
import "./gameRules/index.js";
import { initializeDimensions, registerCustomDimensions } from "./utils/dimension.js";
import { cacheUsernameTables } from "./utils/usernameGenerator.js";

AttributeManager.initialize();
GameRuleManager.initialize();
registerCustomDimensions();
cacheUsernameTables();

world.afterEvents.worldLoad.subscribe(() => {
    initializeDimensions();
    AttributeManager.loadAttributesFromMemory();
    GameRuleManager.loadGameRulesFromMemory();
});
