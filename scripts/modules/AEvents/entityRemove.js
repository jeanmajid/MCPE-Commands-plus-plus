import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "entityRemoveA",
        type: "after",
        description: "Fires when an entity is removed (for example, potentially unloaded, or removed after being killed).",
        event: world.afterEvents.entityRemove,
        code: [],
        source: "world",
        methods: ["removedEntityId", "typeId"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityRemoveA");
        handleEvent(data, module);
    }
);
