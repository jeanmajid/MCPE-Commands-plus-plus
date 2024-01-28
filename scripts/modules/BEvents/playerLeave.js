import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "playerLeaveB",
        type: "before",
        description: "",
        event: world.beforeEvents.playerLeave,
        code: [],
        source: "player",
        methods: ["player"],
        types: ["property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerLeaveB");
        handleEvent(data, module);
    }
);
