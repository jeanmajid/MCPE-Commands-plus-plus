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
    Player,
    world,
    World,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencelist",
        aliases: ["seqlist"],
        description:
            "Lists available sequences or commands in specific sequence matching provided name",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName?: string) => {
        // TODO: use world.sendMessage or origin.sendMessage, or include in message output? Afaik the message has pretty limited length

        const target: Player | World =
            origin.sourceEntity instanceof Player
                ? origin.sourceEntity
                : origin.initiator instanceof Player
                  ? origin.initiator
                  : world;

        if (sequenceName) {
            const data = FUNCTION_MANAGER.getFunctionData(sequenceName);
            switch (data.result) {
                case FMResult.Success: {
                    target.sendMessage(
                        `Listing commands:\n` +
                            data
                                .data!.map((_, i) => `${(i + 1).toString().padStart(2)}: ${_}`)
                                .join("\n")
                    );
                    return {
                        status: CustomCommandStatus.Success,
                        message: `Successfully listed ${data.data?.length} lines from <sequence>/${sequenceName}`,
                    };
                }

                case FMResult.InvalidName:
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Function name contains invalid characters",
                    };

                case FMResult.NotFound:
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Function not found, <sequence>/" + sequenceName,
                    };
            }

            return {
                status: CustomCommandStatus.Failure,
                message: "Unexpected bug, report this issue to github repository",
            };
        }

        const functionNames = FUNCTION_MANAGER.db.keys();

        target.sendMessage(
            `Listing available sequences:\n` + functionNames.map((_) => `- ${_}`).join("\n")
        );
        return {
            status: CustomCommandStatus.Success,
            message: `Successfully listed ${functionNames.length} sequence(s)`,
        };
    }
);
