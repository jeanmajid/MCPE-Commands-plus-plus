import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "entityRemoveB",
        type: "before",
        description: "Fires before an entity is removed from the world (for example, unloaded or removed after being killed.)",
        event: world.beforeEvents.entityRemove,
        code: [],
        source: "removedEntity",
        methods: ["removedEntity"],
        types: ["property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityRemoveB");
        handleEvent(data, module);
    }
);
