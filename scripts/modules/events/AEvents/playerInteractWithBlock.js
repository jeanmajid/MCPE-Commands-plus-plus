import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithBlockA",
        type: "after",
        description: "An event for when a player interacts with a block.",
        event: world.afterEvents.playerInteractWithBlock,
        code: [],
        source: "player",
        methods: ["block", "blockFace", "faceLocation", "itemStack", "player"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithBlockA");
        compileCode(data, module);
    }
);
