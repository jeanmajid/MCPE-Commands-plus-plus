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

import { EntityHealthChangedAfterEvent, ScoreboardObjective, world } from "@minecraft/server";

import { getAllEntities } from "../../utils/dimension.js";
import { AttributeManager, BaseAttribute } from "../attribute.js";

class HealthAttribute extends BaseAttribute {
    public id = "health";
    public event?: (arg0: EntityHealthChangedAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.entityHealthChanged.subscribe(({ entity, newValue }) => {
            this.score.setScore(entity, newValue);
        });
    }

    public setValues(score: ScoreboardObjective): void {
        for (const entity of getAllEntities()) {
            const currentHealth = entity.getComponent("health")?.currentValue;
            if (!currentHealth) {
                continue;
            }

            score.setScore(entity, currentHealth);
        }
    }

    public cleanup(): void {
        world.afterEvents.entityHealthChanged.unsubscribe(this.event!);
    }
}

AttributeManager.register(new HealthAttribute());
