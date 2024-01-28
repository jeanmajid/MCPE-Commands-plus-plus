import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "itemStopUseOnA",
        type: "after",
        description: "This event fires when a player releases the Use Item / Place Block button after successfully using an item. Note: This event cannot be used with Hoe or Axe items.",
        event: world.afterEvents.itemStopUseOn,
        code: [],
        source: "source",
        methods: ["block", "itemStack", "source"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemStopUseOnA");
        handleEvent(data, module);
    }
);
