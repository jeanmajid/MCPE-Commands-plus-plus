import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "chatSendA",
        type: "after",
        description: "This event is triggered after a chat message has been broadcast or sent to players.",
        event: world.afterEvents.chatSend,
        code: [],
        source: "sender",
        methods: ["message", "sender", "targets"],
        types: ["property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("chatSendA");
        compileCode(data, module);
    }
);
