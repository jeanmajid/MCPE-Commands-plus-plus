// optionalParameters: [
//     { name: "rotation", type: CustomCommandParamType.Location },
//     { name: "colorRed", type: CustomCommandParamType.Integer },
//     { name: "colorGreen", type: CustomCommandParamType.Integer },
//     { name: "colorBlue", type: CustomCommandParamType.Integer },
//     { name: "expirationSeconds", type: CustomCommandParamType.Float },
// ],

import { debugDrawer, DebugShape } from "@minecraft/debug-utilities";
import { DimensionLocation, Vector3 } from "@minecraft/server";

export class DrawerManager {
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
        const shapes: DebugShape[] = this.getShapes(shapeId) || [];
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
