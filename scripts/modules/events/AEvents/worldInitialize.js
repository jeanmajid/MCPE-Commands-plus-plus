import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "worldInitializeA",
        type: "after",
        description: "This event fires when the script environment is initialized on a World.",
        event: world.afterEvents.worldInitialize,
        code: [],
        source: "world",
        methods: [],
        types: [],
    },
    (data) => {
        if (!module) module = Module.getModule("worldInitializeA");
        compileCode(data, module);
    }
);
