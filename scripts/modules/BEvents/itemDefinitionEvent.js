import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "itemDefinitionEventB",
        type: "before",
        description: "For custom items, this event is triggered when the fundamental set of defined components for the item change. Note that this event is only fired for custom data-driven items.",
        event: world.beforeEvents.itemDefinitionEvent,
        code: [],
        source: "source",
        methods: ["cancel", "eventName", "itemStack", "source"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemDefinitionEventB");
        handleEvent(data, module);
    }
);
