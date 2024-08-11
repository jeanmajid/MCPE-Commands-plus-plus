import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Bcompiler";

let module = undefined;

Module.register(
    {
        name: "playerGameModeChangeB",
        type: "before",
        description: "",
        event: world.beforeEvents.playerGameModeChange,
        code: [],
        source: "player",
        methods: ["cancel", "fromGameMode", "player", "toGameMode"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerGameModeChangeB");
        compileCode(data, module);
    }
);
