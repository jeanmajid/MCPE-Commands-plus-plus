/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 */

import { CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";

import { CommandManager } from "../../command.js";

let isCurrentlyRunning = false;
export function setIsRunning(isRunning: boolean): void {
    isCurrentlyRunning = isRunning;
}

export function getIsRunning(): boolean {
    return isCurrentlyRunning;
}
CommandManager.register(
    {
        name: "sequenceabort",
        aliases: ["seqabort"],
        description: "Early exit in currently running sequence",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
    },
    () => {
        if (!isCurrentlyRunning) {
            return {
                status: CustomCommandStatus.Failure,
                message: "No sequence is currently running",
            };
        }

        isCurrentlyRunning = false;
        return { status: CustomCommandStatus.Success, message: "Returned early" };
    }
);
