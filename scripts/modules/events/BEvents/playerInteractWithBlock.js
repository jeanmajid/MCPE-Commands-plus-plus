import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithBlockB",
        type: "before",
        description: "Fires before a player interacts with a block.",
        event: world.beforeEvents.playerInteractWithBlock,
        code: [],
        source: "player",
        methods: ["block", "blockFace", "cancel", "faceLocation", "isFirstEvent", "itemStack", "player"],
        types: ["property", "property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithBlockB");
        compileCode(data, module);
    }
);
