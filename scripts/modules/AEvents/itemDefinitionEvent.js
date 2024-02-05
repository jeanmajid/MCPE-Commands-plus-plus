import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "itemDefinitionEventA",
        type: "after",
        description: "For custom items, this event is triggered when the fundamental set of defined components for the item change. Note that this event is only fired for custom data-driven items.",
        event: world.afterEvents.itemDefinitionEvent,
        code: [],
        source: "source",
        methods: ["eventName", "itemStack", "source"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemDefinitionEventA");
        compileCode(data, module);
    }
);
