import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Bcompiler";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithEntityB",
        type: "before",
        description: "Fires before a player interacts with an entity.",
        event: world.beforeEvents.playerInteractWithEntity,
        code: [],
        source: "player",
        methods: ["cancel", "itemStack", "player", "target"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithEntityB");
        compileCode(data, module);
    }
);
