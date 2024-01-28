import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "worldInitializeA",
        type: "after",
        description: "This event fires when the script environment is initialized on a World. In addition, you can register dynamic properties within the scope of a world Initialize event.",
        event: world.afterEvents.worldInitialize,
        code: [],
        source: "world",
        methods: [],
        types: [],
    },
    (data) => {
        if (!module) module = Module.getModule("worldInitializeA");
        handleEvent(data, module);
    }
);
