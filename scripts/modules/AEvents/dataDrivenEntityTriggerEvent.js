import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "dataDrivenEntityTriggerA",
        type: "after",
        description: "This event is fired when an entity event has been triggered that will update the component definition state of an entity.",
        event: world.afterEvents.dataDrivenEntityTrigger,
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
