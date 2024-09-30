import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "projectileHitEntityA",
        type: "after",
        description: "This event fires when a projectile hits an entity.",
        event: world.afterEvents.projectileHitEntity,
        code: [],
        source: "source",
        methods: ["dimension", "hitVector", "location", "projectile", "source", "getEntityHit"],
        types: ["property", "property", "property", "property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("projectileHitEntityA");
        compileCode(data, module);
    }
);
