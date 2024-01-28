import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerDimensionChangeA",
        type: "after",
        description: "Fires when a player moved to a different dimension.",
        event: world.afterEvents.playerDimensionChange,
        code: [],
        source: "player",
        methods: ["fromDimension", "fromLocation", "player", "toDimension", "toLocation"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerDimensionChangeA");
        handleEvent(data, module);
    }
);
