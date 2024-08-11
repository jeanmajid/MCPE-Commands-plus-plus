import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "gameRuleChangeA",
        type: "after",
        description: "This event fires when a world.gameRules property has changed.",
        event: world.afterEvents.gameRuleChange,
        code: [],
        source: "world",
        methods: ["rule", "value"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("gameRuleChangeA");
        compileCode(data, module);
    }
);
