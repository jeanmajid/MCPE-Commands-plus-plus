import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

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
        handleEvent(data, module);
    }
);
