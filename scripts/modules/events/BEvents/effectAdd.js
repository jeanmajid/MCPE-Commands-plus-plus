import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Bcompiler";

let module = undefined;

Module.register(
    {
        name: "effectAddB",
        type: "before",
        description: "This event is triggered after an event has been added to an entity.",
        event: world.beforeEvents.effectAdd,
        code: [],
        source: "entity",
        methods: ["cancel", "duration", "effectType", "entity"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("effectAddB");
        compileCode(data, module);
    }
);
