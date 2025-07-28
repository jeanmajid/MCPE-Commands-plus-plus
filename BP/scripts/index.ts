import { world } from "@minecraft/server";
import { AttributeManager } from "./attributes/attribute.js";
import "./attributes/index.js";
import "./commands/index.js";

world.afterEvents.worldLoad.subscribe(() => {
    AttributeManager.loadAttributesFromMemory();
});
