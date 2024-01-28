import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithEntityB",
        type: "before",
        description: "",
        event: world.beforeEvents.playerInteractWithEntity,
        code: [],
        source: "player",
        methods: ["cancel", "itemStack", "player", "target"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithEntityB");
        handleEvent(data, module);
    }
);
