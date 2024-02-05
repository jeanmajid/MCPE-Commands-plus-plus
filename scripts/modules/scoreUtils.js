import { world } from "@minecraft/server";

export function getScore(target, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(target) ?? 0;
    } catch {
        return 0;
    }
}

export function setScore(player, objective, value) {
    world.scoreboard.getObjective(objective).setScore(player.scoreboardIdentity, value);
}

export function addScore(player, objective, value) {
    world.scoreboard.getObjective(objective).addScore(player.scoreboardIdentity, value);
}
