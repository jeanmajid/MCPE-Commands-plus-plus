import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerJoinA",
        type: "after",
        description: "",
        event: world.afterEvents.playerJoin,
        code: [],
        source: "world",
        methods: ["playerId", "playerName"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerJoinA");
        compileCode(data, module);
    }
);
