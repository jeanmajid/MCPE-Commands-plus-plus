import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "itemUseOnA",
        type: "after",
        description: "This event fires when an item is used on a block by a player.",
        event: world.afterEvents.itemUseOn,
        code: [],
        source: "source",
        methods: ["block", "blockFace", "faceLocation", "itemStack", "source"],
        types: ["property", "property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemUseOnA");
        handleEvent(data, module);
    }
);
