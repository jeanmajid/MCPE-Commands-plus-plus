import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "entityDieA",
        type: "after",
        description: "This event fires when an entity dies.",
        event: world.afterEvents.entityDie,
        code: [],
        source: "deadEntity",
        methods: ["damageSource", "deadEntity"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityDieA");
        compileCode(data, module);
    }
);
