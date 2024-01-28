import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "messageReceiveA",
        type: "after",
        description: "This event is an internal implementation detail, and is otherwise not currently functional.",
        event: world.afterEvents.messageReceive,
        code: [],
        source: "player",
        methods: ["id", "message", "player"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("messageReceiveA");
        handleEvent(data, module);
    }
);
