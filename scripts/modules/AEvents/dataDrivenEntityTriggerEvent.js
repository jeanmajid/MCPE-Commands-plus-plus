import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "dataDrivenEntityTriggerEventA",
        type: "after",
        description: "",
        event: world.afterEvents.dataDrivenEntityTriggerEvent,
        code: [],
        source: "entity",
        methods: ["entity", "eventId", "getModifiers"],
        types: ["property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("dataDrivenEntityTriggerEventA");
        compileCode(data, module);
    }
);
