import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "buttonPushA",
        type: "after",
        description: "",
        event: world.afterEvents.buttonPush,
        code: [],
        source: "source",
        methods: ["source", "block", "dimension"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("buttonPushA");
        compileCode(data, module);
    }
);
