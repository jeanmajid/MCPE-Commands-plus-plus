import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerPlaceBlockB",
        type: "before",
        description: "This event fires before a block is placed by a player.",
        event: world.beforeEvents.playerPlaceBlock,
        code: [],
        source: "player",
        methods: ["cancel", "face", "faceLocation", "itemStack", "player", "block", "dimension"],
        types: ["property", "property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerPlaceBlockB");
        compileCode(data, module);
    }
);
