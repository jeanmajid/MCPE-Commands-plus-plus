import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerBreakBlockA",
        type: "after",
        description: "This event fires for a block that is broken by a player.",
        event: world.afterEvents.playerBreakBlock,
        code: [],
        source: "player",
        methods: ["brokenBlockPermutation", "itemStackAfterBreak", "itemStackBeforeBreak", "player", "block", "dimension"],
        types: ["property", "property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerBreakBlockA");
        compileCode(data, module);
    }
);
