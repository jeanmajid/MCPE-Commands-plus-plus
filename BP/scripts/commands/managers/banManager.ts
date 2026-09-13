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

import { Player, world } from "@minecraft/server";
import { kickPlayer } from "@minecraft/server-admin";

import { BANNED_PLAYER_KEY } from "../../constants/dynamicPropertyKeys";
import { parseDurationString } from "../../utils/time";

//! INCOMPLETE; NEEDS A LOG OF ALL PLAYERS WHO HAVE EVER BEEN IN THE WORLD AND THEIR IDs
// TODO: ALL WIP

interface BannedPlayerData {
    reason: string;
    duration: string;
    banStart: number;
    banEnd: number | null;
}

// TODO add offline banning and fix this mess
export class BanManager {
    public static banPlayer(
        player: Player,
        reason: string,
        duration: string
    ): string | number | null | void {
        const banStart = Date.now();
        const banEnd = parseDurationString(duration);

        if (banEnd.value === undefined) {
            if (banEnd.message) {
                return banEnd.message;
            }
            return;
        }

        const banData: BannedPlayerData = {
            reason: reason,
            duration: duration,
            banStart: banStart,
            banEnd: banEnd.value,
        };

        kickPlayer(player, reason);

        world.setDynamicProperty(
            (BANNED_PLAYER_KEY + player.id) as string,
            JSON.stringify(banData)
        );

        return banEnd.value;
    }

    public static unbanPlayer(player: string): boolean {
        const banKey = BANNED_PLAYER_KEY + player;

        if (!world.getDynamicProperty(banKey)) {
            return false;
        }

        world.setDynamicProperty(banKey, undefined);
        return true;
    }

    public static bannedPlayersList(): void {
        const dynamicProperties = world.getDynamicPropertyIds();
    }
}
