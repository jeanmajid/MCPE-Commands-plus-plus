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

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const ranCommands: Map<string, string> = new Map();

CommandManager.register(
    {
        name: "delay",
        description: "Delays the execution of a command",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "delayInTicks", type: CustomCommandParamType.Integer },
            { name: "command", type: CustomCommandParamType.String },
        ],
    },
    (origin, id: string, delayInTicks: number, command: string) => {
        if (ranCommands.has(id)) {
            return { status: CustomCommandStatus.Failure, message: "ID already running" };
        }
        ranCommands.set(id, command);

        system.runTimeout(() => {
            world.getDimension("overworld").runCommand(command);
            ranCommands.delete(id);
        }, delayInTicks);

        return { status: CustomCommandStatus.Success, message: "Command scheduled to run" };
    }
);
