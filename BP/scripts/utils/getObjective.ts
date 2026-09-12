import { ScoreboardObjective, world } from "@minecraft/server";

export function getScoreboardObjective(objective: string): ScoreboardObjective {
    return world.scoreboard.getObjective(objective) ?? world.scoreboard.addObjective(objective);
}
