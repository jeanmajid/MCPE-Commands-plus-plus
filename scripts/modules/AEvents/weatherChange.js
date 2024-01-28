import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "weatherChangeA",
        type: "after",
        description: "This event will be triggered when the weather changes within Minecraft.",
        event: world.afterEvents.weatherChange,
        code: [],
        source: "world",
        methods: ["dimension", "lightning", "raining"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("weatherChangeA");
        handleEvent(data, module);
    }
);
