import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "projectileHitBlockA",
        type: "after",
        description: "This event fires when a projectile hits a block.",
        event: world.afterEvents.projectileHitBlock,
        code: [],
        source: "source",
        methods: ["dimension", "hitVector", "location", "projectile", "source", "getBlockHit"],
        types: ["property", "property", "property", "property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("projectileHitBlockA");
        handleEvent(data, module);
    }
);
