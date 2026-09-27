import { Vector3 } from "@minecraft/server";

export interface DatabaseBackEnd {
    setDynamicProperty(
        key: string,
        value?: string | number | Vector3 | bigint | boolean | undefined
    ): void;
    getDynamicProperty(key: string): string | number | boolean | Vector3 | bigint | undefined;
    getDynamicPropertyIds(): string[];
}
