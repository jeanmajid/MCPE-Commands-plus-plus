import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "entityHurtA",
        type: "after",
        description: "This event fires when an entity is hurt (takes damage).",
        event: world.afterEvents.entityHurt,
        code: [],
        source: "hurtEntity",
        methods: ["damage", "damageSource", "hurtEntity"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityHurtA");
        compileCode(data, module);
    }
);
