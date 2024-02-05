import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerPlaceBlockA",
        type: "after",
        description: "This event fires for a block that is placed by a player.",
        event: world.afterEvents.playerPlaceBlock,
        code: [],
        source: "player",
        methods: ["player", "block", "dimension"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerPlaceBlockA");
        compileCode(data, module);
    }
);
