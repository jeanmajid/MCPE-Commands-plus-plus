import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "targetBlockHitA",
        type: "after",
        description: "A target block was hit.",
        event: world.afterEvents.targetBlockHit,
        code: [],
        source: "source",
        methods: ["hitVector", "previousRedstonePower", "redstonePower", "source", "block", "dimension"],
        types: ["property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("targetBlockHitA");
        compileCode(data, module);
    }
);
