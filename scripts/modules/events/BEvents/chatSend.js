import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Bcompiler.js";

let module = undefined;

Module.register(
    {
        name: "chatSendB",
        type: "before",
        description: "This event is triggered after a chat message has been broadcast or sent to players.",
        event: world.beforeEvents.chatSend,
        code: [],
        source: "sender",
        methods: ["cancel", "message", "sender", "targets"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("chatSendB");
        compileCode(data, module);
    }
);
