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

import { GameRule, PlayerWaypointsMode } from "@minecraft/server";

export const OPTIMISED_GAMERULE_SETUP = [
    { rule: GameRule.CommandBlockOutput, value: false },
    { rule: GameRule.DoDayLightCycle, value: false },
    { rule: GameRule.DoEntityDrops, value: false },
    { rule: GameRule.DoFireTick, value: false },
    { rule: GameRule.RecipesUnlock, value: false },
    { rule: GameRule.DoLimitedCrafting, value: true },
    { rule: GameRule.DoMobLoot, value: false },
    { rule: GameRule.DoMobSpawning, value: false },
    { rule: GameRule.DoTileDrops, value: false },
    { rule: GameRule.DoWeatherCycle, value: false },
    { rule: GameRule.DrowningDamage, value: false },
    { rule: GameRule.FallDamage, value: false },
    { rule: GameRule.FireDamage, value: false },
    { rule: GameRule.KeepInventory, value: true },
    { rule: GameRule.MobGriefing, value: false },
    { rule: GameRule.Pvp, value: false },
    { rule: GameRule.ShowCoordinates, value: false },
    { rule: GameRule.PlayerWaypoints, value: PlayerWaypointsMode.Off },
    { rule: GameRule.ShowDaysPlayed, value: false },
    { rule: GameRule.NaturalRegeneration, value: false },
    { rule: GameRule.TntExplodes, value: false },
    { rule: GameRule.SendCommandFeedback, value: false },
    { rule: GameRule.DoInsomnia, value: false },
    { rule: GameRule.RandomTickSpeed, value: 0 },
    { rule: GameRule.DoImmediateRespawn, value: true },
    { rule: GameRule.ShowDeathMessages, value: false },
    { rule: GameRule.SpawnRadius, value: 0 },
    { rule: GameRule.ShowTags, value: false },
    { rule: GameRule.FreezeDamage, value: false },
    { rule: GameRule.RespawnBlocksExplode, value: false },
    { rule: GameRule.ShowBorderEffect, value: false },
    { rule: GameRule.ShowRecipeMessages, value: false },
    { rule: GameRule.PlayersSleepingPercentage, value: 101 },
    { rule: GameRule.ProjectilesCanBreakBlocks, value: false },
    { rule: GameRule.TntExplosionDropDecay, value: false },
];
