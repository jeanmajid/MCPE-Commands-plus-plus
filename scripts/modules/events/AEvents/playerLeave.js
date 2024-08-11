import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "playerLeaveA",
        type: "after",
        description: "",
        event: world.afterEvents.playerLeave,
        code: [],
        source: "world",
        methods: ["playerId", "playerName"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerLeaveA");
        compileCode(data, module);
    }
);
