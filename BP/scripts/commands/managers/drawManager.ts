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
    public static setProperty<P extends keyof DebugShape>(
        shapeId: string,
        property: P,
        value: DebugShape[P]
    ): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        for (const shape of shapes) {
            shape[property] = value;
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

    public static removeId(shapeId: string): boolean {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return false;
        }

        for (const shape of shapes) {
            debugDrawer.removeShape(shape);
        }

        return true;
    }

    public static removeAll(): void {
        debugDrawer.removeAll();
    }
}
