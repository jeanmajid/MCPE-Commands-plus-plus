import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "explosionB",
        type: "before",
        description: "This event is fired after an explosion occurs.",
        event: world.beforeEvents.explosion,
        code: [],
        source: "source",
        methods: ["cancel", "setImpactedBlocks", "dimension", "source", "getImpactedBlocks"],
        types: ["property", "function", "property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("explosionB");
        handleEvent(data, module);
    }
);
