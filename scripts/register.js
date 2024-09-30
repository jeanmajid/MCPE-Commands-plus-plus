import { system, world } from "@minecraft/server";
import { Module } from "./models/module.js";

let intervals = {};
let intervalIds = [];

export function register() {
    for (const id of intervalIds) {
        system.clearRun(id);
    }

    intervals = {};
    intervalIds = [];

    for (const module of Module.scoreModules) {
        if (!module.state) continue;
        let scoreboard = world.scoreboard.getObjective(module.scoreboard);
        if (!scoreboard) {
            world.scoreboard.addObjective(module.scoreboard, module.scoreboard);
            scoreboard = world.scoreboard.getObjective(module.scoreboard);
        }
        const intervalObject = intervals[module.interval];
        if (intervalObject) {
            intervalObject.push(module);
        } else {
            intervals[module.interval] = [module];
        }
    }

    for (const module of Module.eventModules) {
        if (module.state && !module.eventId) {
            module.eventId = module.event.subscribe(module.callback);
        } else if (!module.state && module.eventId) {
            module.event.unsubscribe(module.eventId);
            module.eventId = undefined;
        }
    }

    for (const interval in intervals) {
        const intervalTicks = parseInt(interval);
        const id = system.runInterval(() => {
            const modules = intervals[interval];
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                const players = world.getAllPlayers();
                for (let i = 0; i < players.length; i++) {
                    const player = players[i];
                    module.callback(player);
                }
            }
        }, intervalTicks);
        intervalIds.push(id);
    }
}

register();
