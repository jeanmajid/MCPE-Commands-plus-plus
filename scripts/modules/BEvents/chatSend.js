import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "chatSendB",
        type: "before",
        description: "This event is triggered after a chat message has been broadcast or sent to players.",
        event: world.beforeEvents.chatSend,
        code: [],
        source: "sender",
        methods: ["cancel", "setTargets", "message", "sender", "sendToTargets", "getTargets"],
        types: ["property", "function", "property", "property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("chatSendB");
        handleEvent(data, module);
    }
);
