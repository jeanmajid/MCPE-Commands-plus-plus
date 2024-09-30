import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerGameModeChangeA",
        type: "after",
        description: "",
        event: world.afterEvents.playerGameModeChange,
        code: [],
        source: "player",
        methods: ["fromGameMode", "player", "toGameMode"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerGameModeChangeA");
        compileCode(data, module);
    }
);
