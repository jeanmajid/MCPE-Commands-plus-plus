import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

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
        compileCode(data, module);
    }
);
