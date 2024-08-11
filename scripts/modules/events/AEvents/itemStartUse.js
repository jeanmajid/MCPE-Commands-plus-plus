import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "itemStartUseA",
        type: "after",
        description: "This event fires when a chargeable item starts charging.",
        event: world.afterEvents.itemStartUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source", "useDuration"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemStartUseA");
        compileCode(data, module);
    }
);
