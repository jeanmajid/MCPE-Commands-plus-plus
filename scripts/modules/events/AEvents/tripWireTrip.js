import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "tripWireTripA",
        type: "after",
        description: "A trip wire was tripped.",
        event: world.afterEvents.tripWireTrip,
        code: [],
        source: "world",
        methods: ["isPowered", "sources", "block", "dimension"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("tripWireTripA");
        compileCode(data, module);
    }
);
