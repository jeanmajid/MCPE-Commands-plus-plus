import { world } from "@minecraft/server";
import { Module } from "../../module.js";
import { handleEvent } from "./utils.js";

let module = undefined;

Module.register(
    {
        name: "entityHitEntityA",
        type: "after",
        description: "This event fires when an entity hits (that is, melee attacks) another entity.",
        event: world.afterEvents.entityHitEntity,
        code: [],
        source: "hitEntity",
        methods: ["damagingEntity", "hitEntity"],
        types: ["property", "property"],
    },
    (data) => {
        if (!module) module = Module.getModule("entityHitEntityA");
        handleEvent(data, module);
    }
);
