import { world } from "@minecraft/server";

/**
 * @description Retrieves the score of a target from a specified objective in the scoreboard.
 * @param {import("@minecraft/server").Entity | string} target - The target whose score is to be retrieved.
 * @param {string} objective - The objective from which the score is to be retrieved.
 * @returns {number} The score of the target in the specified objective, or 0 if the objective or score does not exist.
 */
export function getScore(target, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(target) ?? 0;
    } catch {
        return 0;
    }
}

/**
 * @description Sets the score for a player in a specified objective.
 * @param {import("@minecraft/server").Entity} entity - The player whose score is to be set.
 * @param {string} objective - The name of the objective in which the score is to be set.
 * @param {number} value - The score value to be set for the player.
 */
export function setScore(entity, objective, value) {
    world.scoreboard.getObjective(objective).setScore(entity.scoreboardIdentity, value);
}


/**
 * @description Adds a score to an entity for a specified objective.
 * @param {Entity} entity - The entity to which the score will be added.
 * @param {string} objective - The name of the objective.
 * @param {number} value - The value to add to the score.
 */
export function addScore(entity, objective, value) {
    world.scoreboard.getObjective(objective).addScore(entity.scoreboardIdentity, value);
}
