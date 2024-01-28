import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "buttonPushA",
        type: "after",
        description: "",
        event: world.afterEvents.buttonPush,
        code: [],
        source: "source",
        methods: ["source", "block", "dimension"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("buttonPushA");
        handleEvent(data, module);
    }
);
