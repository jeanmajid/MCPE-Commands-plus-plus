import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerInteractWithEntityA",
        type: "after",
        description: "",
        event: world.afterEvents.playerInteractWithEntity,
        code: [],
        source: "player",
        methods: ["itemStack", "player", "target"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInteractWithEntityA");
        handleEvent(data, module);
    }
);
