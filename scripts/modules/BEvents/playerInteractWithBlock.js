import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithBlockB",
        type: "before",
        description: "",
        event: world.beforeEvents.playerInteractWithBlock,
        code: [],
        source: "player",
        methods: ["block", "blockFace", "cancel", "faceLocation", "itemStack", "player"],
        types: ["property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithBlockB");
        handleEvent(data, module);
    }
);
