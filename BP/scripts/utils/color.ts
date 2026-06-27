import { RGB, RGBA } from "@minecraft/server";

export function getNormalizedRgb(red: number, green: number, blue: number): RGB {
    return { red: red / 255, green: green / 255, blue: blue / 255 };
}

export function getNormalizedRgba(red: number, green: number, blue: number, alpha: number): RGBA {
    return { red: red / 255, green: green / 255, blue: blue / 255, alpha: alpha / 255 };
}
