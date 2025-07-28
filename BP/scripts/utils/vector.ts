import { Vector3 } from "@minecraft/server";

export class Vector {
    static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return { x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z };
    }

    static subtract(vector1: Vector3, vector2: Vector3): Vector3 {
        return { x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z };
    }

    static multiply(vector: Vector3, scalar: number): Vector3 {
        return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar };
    }

    static divide(vector: Vector3, scalar: number): Vector3 {
        return { x: vector.x / scalar, y: vector.y / scalar, z: vector.z / scalar };
    }

    static dotProduct(vector1: Vector3, vector2: Vector3): number {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    static crossProduct(vector1: Vector3, vector2: Vector3): Vector3 {
        const x = vector1.y * vector2.z - vector1.z * vector2.y;
        const y = vector1.z * vector2.x - vector1.x * vector2.z;
        const z = vector1.x * vector2.y - vector1.y * vector2.x;
        return { x: x, y: y, z: z };
    }

    static magnitude(vector: Vector3): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    }

    static normalize(vector: Vector3): Vector3 {
        const magnitude = Vector.magnitude(vector);
        return { x: vector.x / magnitude, y: vector.y / magnitude, z: vector.z / magnitude };
    }

    static locationInfront(location: Vector3, direction: Vector3, distance: number): Vector3 {
        return Vector.add(location, Vector.multiply(direction, distance));
    }

    static distance(vector1: Vector3, vector2: Vector3): number {
        const dx = vector2.x - vector1.x;
        const dy = vector2.y - vector1.y;
        const dz = vector2.z - vector1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    static toString(vector: Vector3): string {
        return `${vector.x}, ${vector.y}, ${vector.z}`;
    }

    static toStringFloored(vector: Vector3): string {
        return `${Math.floor(vector.x)}, ${Math.floor(vector.y)}, ${Math.floor(vector.z)}`;
    }
}
