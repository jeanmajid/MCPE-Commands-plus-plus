import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithEntityA",
        type: "after",
        description: "This event fires when a player interacts with an entity.",
        event: world.afterEvents.playerInteractWithEntity,
        code: [],
        source: "player",
        methods: ["itemStack", "player", "target"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithEntityA");
        compileCode(data, module);
    }
);
