import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "chatSendA",
        type: "after",
        description: "This event is triggered after a chat message has been broadcast or sent to players.",
        event: world.afterEvents.chatSend,
        code: [],
        source: "sender",
        methods: ["message", "sender", "sendToTargets", "getTargets"],
        types: ["property", "property", "property", "function"],
    },
    (data) => {
        if (!module) module = Module.getModule("chatSendA");
        handleEvent(data, module);
    }
);
