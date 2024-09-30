import { world } from "@minecraft/server";
import { Module } from "../../../models/module.js";
import { compileCode } from "../../../compiler/Acompiler.js";

let module = undefined;

Module.register(
    {
        name: "playerEmoteA",
        type: "after",
        description: "",
        event: world.afterEvents.playerEmote,
        code: [],
        source: "player",
        methods: ["personaPieceId", "player"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("playerEmoteA");
        compileCode(data, module);
    }
);
