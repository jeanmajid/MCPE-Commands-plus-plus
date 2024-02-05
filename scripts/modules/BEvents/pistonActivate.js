import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "pistonActivateB",
        type: "before",
        description: "This event fires when a piston expands or retracts.",
        event: world.beforeEvents.pistonActivate,
        code: [],
        source: "world",
        methods: ["cancel", "isExpanding", "piston", "block", "dimension"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("pistonActivateB");
        compileCode(data, module);
    }
);
