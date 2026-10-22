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
