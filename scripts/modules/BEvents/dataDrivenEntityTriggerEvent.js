import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "dataDrivenEntityTriggerEventB",
        type: "before",
        description: "This event is fired when an entity event has been triggered that will update the component definition state of an entity.",
        event: world.beforeEvents.dataDrivenEntityTriggerEvent,
        code: [],
        source: "entity",
        methods: ["cancel", "entity", "id", "getModifiers", "setModifiers"],
        types: ["property", "property", "property", "function", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("dataDrivenEntityTriggerEventB");
        handleEvent(data, module);
    }
);
