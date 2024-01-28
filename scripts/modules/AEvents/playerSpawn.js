import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

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
        handleEvent(data, module);
    }
);
