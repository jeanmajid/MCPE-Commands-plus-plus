import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "effectAddA",
        type: "after",
        description: "This event fires when an effect, like poisoning, is added to an entity.",
        event: world.afterEvents.effectAdd,
        code: [],
        source: "entity",
        methods: ["effect", "entity"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("effectAddA");
        handleEvent(data, module);
    }
);
