import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { compileCode } from "../../../compiler/Acompiler";

let module = undefined;

Module.register(
    {
        name: "itemStartUseOnA",
        type: "after",
        description: "This event fires when a player successfully uses an item or places a block by pressing the Use Item / Place Block button. If multiple blocks are placed, this event will only occur once at the beginning of the block placement. Note: This event cannot be used with Hoe or Axe items.",
        event: world.afterEvents.itemStartUseOn,
        code: [],
        source: "source",
        methods: ["block", "blockFace", "itemStack", "source"],
        types: ["property", "property", "property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("itemStartUseOnA");
        compileCode(data, module);
    }
);
