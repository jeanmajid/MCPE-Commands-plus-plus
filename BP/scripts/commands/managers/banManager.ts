import { Player, world } from "@minecraft/server";
import { kickPlayer } from "@minecraft/server-admin";

import { BANNED_PLAYER_KEY } from "../../constants/dynamicPropertyKeys";
import { DurationReturn, parseDurationString } from "../../utils/time";

//! INCOMPLETE; NEEDS A LOG OF ALL PLAYERS WHO HAVE EVER BEEN IN THE WORLD AND THEIR IDs

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
    ): string | number | void {
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
