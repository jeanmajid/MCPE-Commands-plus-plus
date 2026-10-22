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
    EntityStartSneakingAfterEvent,
    EntityStopSneakingAfterEvent,
    ScoreboardObjective,
    world,
} from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

class IsSneakingAttribute extends BaseAttribute {
    public id = "isSneaking";
    public startEvent?: (arg0: EntityStartSneakingAfterEvent) => void;
    public stopEvent?: (arg0: EntityStopSneakingAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.startEvent = world.afterEvents.entityStartSneaking.subscribe(
            ({ entity }) => {
                this.score.setScore(entity, 1);
            },
            { entityFilter: { type: "minecraft:player" } }
        );

        this.stopEvent = world.afterEvents.entityStopSneaking.subscribe(
            ({ entity }) => {
                this.score.setScore(entity, 0);
            },
            { entityFilter: { type: "minecraft:player" } }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            score.setScore(player, player.isSneaking ? 1 : 0);
        }
    }

    public cleanup(): void {
        world.afterEvents.entityStartSneaking.unsubscribe(this.startEvent!);
        world.afterEvents.entityStopSneaking.unsubscribe(this.startEvent!);
    }
}

AttributeManager.register(new IsSneakingAttribute());
