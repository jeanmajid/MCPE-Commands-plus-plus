import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Bcompiler";

let module = undefined;

Module.register(
    {
        name: "worldInitializeB",
        type: "before",
        description: "This event fires immediately when the script environment is initialized on a World. Not all script functionality may be available. For guaranteed access to world state, use the world initialize after event.",
        event: world.beforeEvents.worldInitialize,
        code: [],
        source: "world",
        methods: ["blockTypeRegistry", "itemComponentRegistry"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("worldInitializeB");
        compileCode(data, module);
    }
);
