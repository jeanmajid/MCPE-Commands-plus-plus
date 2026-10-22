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

import {
    PlayerHotbarSelectedSlotChangeAfterEvent,
    ScoreboardObjective,
    world,
} from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

class HotbarSelectedSlotAttribute extends BaseAttribute {
    public id = "selectedHotbarSlot";
    public event?: (arg0: PlayerHotbarSelectedSlotChangeAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.playerHotbarSelectedSlotChange.subscribe(
            ({ player, newSlotSelected }) => {
                this.score.setScore(player, newSlotSelected);
            }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            score.setScore(player, player.selectedSlotIndex);
        }
    }

    public cleanup(): void {
        world.afterEvents.playerHotbarSelectedSlotChange.unsubscribe(this.event!);
    }
}

AttributeManager.register(new HotbarSelectedSlotAttribute());
