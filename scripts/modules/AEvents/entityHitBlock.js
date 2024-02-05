import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "entityHitBlockA",
        type: "after",
        description: "This event fires when an entity hits (that is, melee attacks) a block.",
        event: world.afterEvents.entityHitBlock,
        code: [],
        source: "damagingEntity",
        methods: ["blockFace", "damagingEntity", "hitBlock"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityHitBlockA");
        compileCode(data, module);
    }
);
