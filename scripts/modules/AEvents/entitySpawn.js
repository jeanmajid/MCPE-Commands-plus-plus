import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "entitySpawnA",
        type: "after",
        description: "This event fires when an entity is spawned.",
        event: world.afterEvents.entitySpawn,
        code: [],
        source: "entity",
        methods: ["cause", "entity"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entitySpawnA");
        compileCode(data, module);
    }
);
