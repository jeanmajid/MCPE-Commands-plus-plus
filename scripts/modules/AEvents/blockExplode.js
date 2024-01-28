import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "blockExplodeA",
        type: "after",
        description: "This event fires for each BlockLocation destroyed by an explosion. It is fired after the blocks have already been destroyed.",
        event: world.afterEvents.blockExplode,
        code: [],
        source: "source",
        methods: ["explodedBlockPermutation", "source", "block", "dimension"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("blockExplodeA");
        handleEvent(data, module);
    }
);
