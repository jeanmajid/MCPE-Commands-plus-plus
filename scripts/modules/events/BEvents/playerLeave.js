import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerLeaveB",
        type: "before",
        description: "Fires when a player leaves the game.",
        event: world.beforeEvents.playerLeave,
        code: [],
        source: "player",
        methods: ["player"],
        types: ["property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerLeaveB");
        compileCode(data, module);
    }
);
