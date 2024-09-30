import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerInputPermissionCategoryChangeA",
        type: "after",
        description: "This event fires when a players input permissions change.",
        event: world.afterEvents.playerInputPermissionCategoryChange,
        code: [],
        source: "player",
        methods: ["category", "enabled", "player"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerInputPermissionCategoryChangeA");
        compileCode(data, module);
    }
);
