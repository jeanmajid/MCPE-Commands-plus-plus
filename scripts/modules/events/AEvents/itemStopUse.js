import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "itemStopUseA",
        type: "after",
        description: "This event fires when a chargeable item stops charging.",
        event: world.afterEvents.itemStopUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source", "useDuration"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemStopUseA");
        compileCode(data, module);
    }
);
