import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithBlockA",
        type: "after",
        description: "",
        event: world.afterEvents.playerInteractWithBlock,
        code: [],
        source: "player",
        methods: ["block", "blockFace", "faceLocation", "itemStack", "player"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithBlockA");
        handleEvent(data, module);
    }
);
