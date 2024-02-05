import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "pressurePlatePushA",
        type: "after",
        description: "A pressure plate has pushed (at least one entity has moved onto a pressure plate.)",
        event: world.afterEvents.pressurePlatePush,
        code: [],
        source: "source",
        methods: ["previousRedstonePower", "redstonePower", "source", "block", "dimension"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("pressurePlatePushA");
        compileCode(data, module);
    }
);
