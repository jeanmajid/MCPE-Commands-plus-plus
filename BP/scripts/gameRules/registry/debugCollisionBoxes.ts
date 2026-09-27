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

import { DebugBox, debugDrawer } from "@minecraft/debug-utilities";
import { Entity, system } from "@minecraft/server";

import { getAllEntities } from "../../utils/dimension.js";
import { Vector } from "../../utils/vector.js";
import { BaseGameRule, GameRuleManager } from "../gameRule.js";

class DebugCollisionBoxesGameRule extends BaseGameRule<boolean> {
    public id: string = "debugCollisionBoxes";
    public value: boolean = false;

    private runId = -1;
    private drawnShapes: Map<string, DebugBox> = new Map();

    public onValueUpdate(): void {
        if (this.value) {
            this.enable();
        } else {
            this.disable();
        }
    }

    private enable(): void {
        // TODO: Use events pleeaaaseee, im lazy
        // Also undraw the shapes
        this.runId = system.runInterval(() => {
            for (const entity of getAllEntities()) {
                this.drawHitbox(entity);
            }
        }, 1);
    }

    private disable(): void {
        if (this.runId === -1) {
            return;
        }

        for (const [_entityId, shape] of this.drawnShapes) {
            shape.remove();
        }

        this.drawnShapes.clear();
        system.clearRun(this.runId);
        this.runId = -1;
    }

    private drawHitbox(entity: Entity): void {
        if (this.drawnShapes.has(entity.id)) {
            return;
        }
        const aabb = entity.getAABB();

        const box = new DebugBox({ x: 0, y: aabb.extent.y, z: 0, dimension: entity.dimension });
        box.attachedTo = entity;
        box.bound = Vector.multiply(aabb.extent, 2);

        entity.collisionBoxShape = box;
        this.drawnShapes.set(entity.id, box);
        debugDrawer.addShape(box);
    }
}

GameRuleManager.register(new DebugCollisionBoxesGameRule());
