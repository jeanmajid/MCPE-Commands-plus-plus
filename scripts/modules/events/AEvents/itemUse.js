import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemUseA",
        type: "after",
        description: "This event fires when an item is successfully used by a player.",
        event: world.afterEvents.itemUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemUseA");
        compileCode(data, module);
    }
);
