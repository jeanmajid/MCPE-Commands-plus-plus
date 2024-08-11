import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "weatherChangeA",
        type: "after",
        description: "This event will be triggered when the weather changes within Minecraft.",
        event: world.afterEvents.weatherChange,
        code: [],
        source: "world",
        methods: ["dimension", "newWeather", "previousWeather"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("weatherChangeA");
        compileCode(data, module);
    }
);
