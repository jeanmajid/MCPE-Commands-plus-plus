import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerBreakBlockB",
        type: "before",
        description: "This event fires before a block is broken by a player.",
        event: world.beforeEvents.playerBreakBlock,
        code: [],
        source: "player",
        methods: ["cancel", "itemStack", "player", "block", "dimension"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerBreakBlockB");
        compileCode(data, module);
    }
);
