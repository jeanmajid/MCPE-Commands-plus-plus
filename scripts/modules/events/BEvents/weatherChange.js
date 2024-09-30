import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "weatherChangeB",
        type: "before",
        description: "",
        event: world.beforeEvents.weatherChange,
        code: [],
        source: "world",
        methods: ["cancel", "duration", "newWeather", "previousWeather"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("weatherChangeB");
        compileCode(data, module);
    }
);
