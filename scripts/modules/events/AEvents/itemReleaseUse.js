import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemReleaseUseA",
        type: "after",
        description: "This event fires when a chargeable item is released from charging.",
        event: world.afterEvents.itemReleaseUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source", "useDuration"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemReleaseUseA");
        compileCode(data, module);
    }
);
