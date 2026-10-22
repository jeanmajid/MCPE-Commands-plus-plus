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
    system,
    Dimension,
    Entity,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";
import { getIsRunning, setIsRunning } from "./sequenceAbort.js";

CommandManager.register(
    {
        name: "sequencerun",
        aliases: ["seqrun"],
        description: "Runs a sequence matching specified name",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName: string) => {
        const data = FUNCTION_MANAGER.getFunctionData(sequenceName);
        if (!data.data) {
            switch (data.result) {
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
        const dimension: Dimension | null =
            origin.sourceEntity?.dimension ??
            origin.sourceBlock?.dimension ??
            origin.initiator?.dimension ??
            null;

        const target: Dimension | Entity | null = origin.sourceEntity ?? origin.initiator ?? null;

        const commands = data.data;
        system.run(() => {
            const src = target ?? dimension ?? Dimensions.overworld;

            setIsRunning(true);
            for (const command of commands) {
                if (!getIsRunning()) {
                    break;
                }
                src.runCommand(command);
            }
            setIsRunning(false);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully queued '<sequence>/${sequenceName}' with ${commands.length} command(s)`,
        };
    }
);
