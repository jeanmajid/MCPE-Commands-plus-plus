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

import { Vector3 } from "@minecraft/server";

export class Vector {
    public static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return { x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z };
    }

    public static subtract(vector1: Vector3, vector2: Vector3): Vector3 {
        return { x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z };
    }

    public static multiply(vector: Vector3, scalar: number): Vector3 {
        return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar };
    }

    public static divide(vector: Vector3, scalar: number): Vector3 {
        return { x: vector.x / scalar, y: vector.y / scalar, z: vector.z / scalar };
    }

    public static dotProduct(vector1: Vector3, vector2: Vector3): number {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    public static crossProduct(vector1: Vector3, vector2: Vector3): Vector3 {
        const x = vector1.y * vector2.z - vector1.z * vector2.y;
        const y = vector1.z * vector2.x - vector1.x * vector2.z;
        const z = vector1.x * vector2.y - vector1.y * vector2.x;
        return { x: x, y: y, z: z };
    }

    public static magnitude(vector: Vector3): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    }

    public static normalize(vector: Vector3): Vector3 {
        const magnitude = Vector.magnitude(vector);
        return { x: vector.x / magnitude, y: vector.y / magnitude, z: vector.z / magnitude };
    }

    public static locationInfront(
        location: Vector3,
        direction: Vector3,
        distance: number
    ): Vector3 {
        return Vector.add(location, Vector.multiply(direction, distance));
    }

    public static distance(vector1: Vector3, vector2: Vector3): number {
        const dx = vector2.x - vector1.x;
        const dy = vector2.y - vector1.y;
        const dz = vector2.z - vector1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    public static toString(vector: Vector3): string {
        return `${vector.x}, ${vector.y}, ${vector.z}`;
    }

    public static toStringFloored(vector: Vector3): string {
        return `${Math.floor(vector.x)}, ${Math.floor(vector.y)}, ${Math.floor(vector.z)}`;
    }
}
