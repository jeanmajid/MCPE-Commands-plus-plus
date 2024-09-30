import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "pressurePlatePopA",
        type: "after",
        description: "A pressure plate has popped back up (i.e., there are no entities on the pressure plate.)",
        event: world.afterEvents.pressurePlatePop,
        code: [],
        source: "world",
        methods: ["previousRedstonePower", "redstonePower", "block", "dimension"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("pressurePlatePopA");
        compileCode(data, module);
    }
);
