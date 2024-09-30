import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemUseOnB",
        type: "before",
        description: "This event fires when an item is used on a block by a player.",
        event: world.beforeEvents.itemUseOn,
        code: [],
        source: "source",
        methods: ["cancel", "block", "blockFace", "faceLocation", "isFirstEvent", "itemStack", "source"],
        types: ["property", "property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemUseOnB");
        compileCode(data, module);
    }
);
