import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

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
