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

// optionalParameters: [
//     { name: "rotation", type: CustomCommandParamType.Location },
//     { name: "colorRed", type: CustomCommandParamType.Integer },
//     { name: "colorGreen", type: CustomCommandParamType.Integer },
//     { name: "colorBlue", type: CustomCommandParamType.Integer },
//     { name: "expirationSeconds", type: CustomCommandParamType.Float },
// ],

import { debugDrawer, DebugShape } from "@minecraft/debug-utilities";
import { DimensionLocation, Vector3 } from "@minecraft/server";

export class DrawManager {
    public static shapeCount: number = 0;
    private static shapes: Map<string, DebugShape[]> = new Map();

    /**
     * @returns all shapes grouped under the specified id or if not found undefined
     */
    public static getShapes(shapeId: string): DebugShape[] | undefined {
        return this.shapes.get(shapeId);
    }

    /**
     * add a shape to a group of shapes under the id
     */
    public static addShape(shapeId: string, shape: DebugShape): void {
        const shapes: DebugShape[] = this.getShapes(shapeId) ?? [];
        shapes.push(shape);

        this.shapes.set(shapeId, shapes);
        ++this.shapeCount;
    }

    /**
     * set a property of a group of shapes
     */
    public static setProperty<T extends DebugShape, P extends keyof T>(
        shapeId: string,
        property: P,
        value: T[P],
        // oxlint-disable-next-line typescript/no-explicit-any
        targetShape?: abstract new (...args: any[]) => T
    ): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        if (!targetShape) {
            for (const shape of shapes) {
                (shape as T)[property] = value;
            }
        } else {
            for (const shape of shapes) {
                if (shape instanceof targetShape) {
                    (shape as T)[property] = value;
                }
            }
        }

        return true;
    }

    public static setLocation(shapeId: string, location: Vector3 | DimensionLocation): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        for (const shape of shapes) {
            shape.setLocation(location);
        }

        return true;
    }

    public static drawId(shapeId: string): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        for (const shape of shapes) {
            debugDrawer.addShape(shape);
        }

        return true;
    }

    public static undrawId(shapeId: string): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        for (const shape of shapes) {
            debugDrawer.removeShape(shape);
        }

        return true;
    }

    public static undrawAll(): void {
        debugDrawer.removeAll();
    }

    public static removeId(id: string): boolean {
        const result = this.undrawId(id);

        if (!result) {
            return false;
        }

        this.shapes.delete(id);

        return true;
    }

    public static removeAll(): void {
        this.undrawAll();
        this.shapes.clear();
    }
}
