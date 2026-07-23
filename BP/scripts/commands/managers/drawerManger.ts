// optionalParameters: [
//     { name: "rotation", type: CustomCommandParamType.Location },
//     { name: "colorRed", type: CustomCommandParamType.Integer },
//     { name: "colorGreen", type: CustomCommandParamType.Integer },
//     { name: "colorBlue", type: CustomCommandParamType.Integer },
//     { name: "expirationSeconds", type: CustomCommandParamType.Float },
// ],

import { DebugShape } from "@minecraft/debug-utilities";
import { DimensionLocation, Vector3 } from "@minecraft/server";

export class DrawerManager {
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
        const shapes: DebugShape[] = this.shapes.get(shapeId) || [];
        shapes.push(shape);
    }

    /**
     * set a property of a group of shapes
     */
    public static setProperty<P extends keyof DebugShape>(
        shapeId: string,
        property: P,
        value: DebugShape[P]
    ): void {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return;
        }

        for (const shape of shapes) {
            shape[property] = value;
        }
    }

    public static setLocation(shapeId: string, location: Vector3 | DimensionLocation): void {
        const shapes = this.getShapes(shapeId);

        if (!shapes) {
            return;
        }

        for (const shape of shapes) {
            shape.setLocation(location);
        }
    }
}
