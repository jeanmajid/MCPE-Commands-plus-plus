import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerSpawnA",
        type: "after",
        description: "",
        event: world.afterEvents.playerSpawn,
        code: [],
        source: "player",
        methods: ["initialSpawn", "player"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerSpawnA");
        compileCode(data, module);
    }
);
