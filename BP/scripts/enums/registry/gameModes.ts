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

import { GameMode } from "@minecraft/server";

import { EnumManager } from "../enum.js";

export const GAME_MODE_ALIASED_ENUM_KEY = "gameModeAliasedEnum";
export enum GameModeAliased {
    survival = GameMode.Survival,
    creative = GameMode.Creative,
    adventure = GameMode.Adventure,
    spectator = GameMode.Spectator,
    s = GameMode.Survival,
    c = GameMode.Creative,
    a = GameMode.Adventure,
    sp = GameMode.Spectator,
}

EnumManager.register(GAME_MODE_ALIASED_ENUM_KEY, Object.keys(GameModeAliased));
