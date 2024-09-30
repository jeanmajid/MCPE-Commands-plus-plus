import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "entityLoadA",
        type: "after",
        description: "Fires when an entity is loaded.",
        event: world.afterEvents.entityLoad,
        code: [],
        source: "entity",
        methods: ["entity"],
        types: ["property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityLoadA");
        compileCode(data, module);
    }
);
