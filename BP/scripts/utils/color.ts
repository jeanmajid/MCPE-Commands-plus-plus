import { RGB } from "@minecraft/server";

export function getNormalizedRgb(red: number, green: number, blue: number): RGB {
    return { red: red / 255, green: green / 255, blue: blue / 255 };
}
