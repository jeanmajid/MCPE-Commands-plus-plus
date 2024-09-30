import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "pistonActivateA",
        type: "after",
        description: "This event fires when a piston expands or retracts.",
        event: world.afterEvents.pistonActivate,
        code: [],
        source: "world",
        methods: ["isExpanding", "piston", "block", "dimension"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("pistonActivateA");
        compileCode(data, module);
    }
);
