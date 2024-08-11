import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "entityHealthChangedA",
        type: "after",
        description: "This event fires when entity health changes in any degree.",
        event: world.afterEvents.entityHealthChanged,
        code: [],
        source: "entity",
        methods: ["entity", "newValue", "oldValue"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityHealthChangedA");
        compileCode(data, module);
    }
);
