import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemUseB",
        type: "before",
        description: "This event fires when an item is successfully used by a player.",
        event: world.beforeEvents.itemUse,
        code: [],
        source: "source",
        methods: ["cancel", "itemStack", "source"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemUseB");
        compileCode(data, module);
    }
);
