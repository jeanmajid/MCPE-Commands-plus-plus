import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "itemCompleteUseA",
        type: "after",
        description: "This event fires when a chargeable item completes charging.",
        event: world.afterEvents.itemCompleteUse,
        code: [],
        source: "source",
        methods: ["itemStack", "source", "useDuration"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemCompleteUseA");
        handleEvent(data, module);
    }
);
