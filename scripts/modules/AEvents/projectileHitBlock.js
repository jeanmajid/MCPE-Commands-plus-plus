import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

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
        compileCode(data, module);
    }
);
