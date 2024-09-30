import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemUseOnA",
        type: "after",
        description: "This event fires when an item is used on a block by a player.",
        event: world.afterEvents.itemUseOn,
        code: [],
        source: "source",
        methods: ["block", "blockFace", "faceLocation", "isFirstEvent", "itemStack", "source"],
        types: ["property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemUseOnA");
        compileCode(data, module);
    }
);
