import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "leverActionA",
        type: "after",
        description: "",
        event: world.afterEvents.leverAction,
        code: [],
        source: "player",
        methods: ["isPowered", "player", "block", "dimension"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("leverActionA");
        compileCode(data, module);
    }
);
