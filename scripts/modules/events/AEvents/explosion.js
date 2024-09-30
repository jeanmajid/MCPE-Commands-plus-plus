import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "explosionA",
        type: "after",
        description: "This event is fired after an explosion occurs.",
        event: world.afterEvents.explosion,
        code: [],
        source: "source",
        methods: ["dimension", "source", "getImpactedBlocks"],
        types: ["property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("explosionA");
        compileCode(data, module);
    }
);
