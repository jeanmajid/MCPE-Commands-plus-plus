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
    CustomCommandParamType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequenceinsert",
        aliases: ["seqinsert"],
        description: "Inserts new commands to the sequences at specified line",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "sequenceName", type: CustomCommandParamType.String },
            { name: "command", type: CustomCommandParamType.String },
        ],
        optionalParameters: [{ name: "line", type: CustomCommandParamType.Integer }],
    },
    (origin, sequenceName: string, command: string, line?: number) => {
        if (line !== undefined) {
            line -= 1; // map to index

            if (line < 0) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Line has to be positive integer",
                };
            }
        }

        const status = FUNCTION_MANAGER.insertC(sequenceName, command, line);

        switch (status) {
            case FMResult.Success:
                return {
                    status: CustomCommandStatus.Success,
                    message: "Successfully inserted command into the <sequence>/" + sequenceName,
                };

            case FMResult.InvalidName:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence name contains invalid characters",
                };

            case FMResult.NotFound:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence with this name doesn't exists, <sequence>/" + sequenceName,
                };
        }

        return {
            status: CustomCommandStatus.Failure,
            message: "Unexpected bug, report this issue to github repository",
        };
    }
);
