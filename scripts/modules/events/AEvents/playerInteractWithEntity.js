import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithEntityA",
        type: "after",
        description: "This event fires when a player interacts with an entity.",
        event: world.afterEvents.playerInteractWithEntity,
        code: [],
        source: "player",
        methods: ["beforeItemStack", "itemStack", "player", "target"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithEntityA");
        compileCode(data, module);
    }
);
