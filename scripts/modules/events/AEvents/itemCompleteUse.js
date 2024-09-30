import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemCompleteUseA",
        type: "after",
        description: "This event fires when a chargeable item completes charging.",
        event: world.afterEvents.itemCompleteUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source", "useDuration"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemCompleteUseA");
        compileCode(data, module);
    }
);
