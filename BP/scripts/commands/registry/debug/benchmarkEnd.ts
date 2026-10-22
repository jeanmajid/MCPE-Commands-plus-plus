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
    CustomCommandParamType,
    CustomCommandStatus,
    system,
    world,
} from "@minecraft/server";

import { LOG_TYPE_ENUM_KEY, LogType } from "../../../enums/registry/logType.js";
import { CommandManager } from "../../command.js";
import { benchmark_data } from "./benchmarkStart.js";
import { log } from "./log.js";

CommandManager.register(
    {
        name: "benchmarkend",
        description: "Logs and saves the time since the benchmark started in milliseconds",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "startId", type: CustomCommandParamType.String }],
        optionalParameters: [
            { name: "logType", type: CustomCommandParamType.Enum, enumName: LOG_TYPE_ENUM_KEY },
            { name: "fakeplayer", type: CustomCommandParamType.String },
            { name: "objective", type: CustomCommandParamType.String },
        ],
    },
    (
        origin,
        startId: string,
        logType: LogType = LogType.Info,
        fakeplayer: string,
        objective: string
    ) => {
        const start = benchmark_data[startId];
        if (!start) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Could not find a benchmark test with the start ID ${startId}`,
            };
        }

        const elapsedTime = Date.now() - start;

        const output = `[${startId}] Elapsed ${elapsedTime}ms`;
        const result = log(output, logType);
        if (result.status === CustomCommandStatus.Failure) {
            return result;
        }

        if (!fakeplayer) {
            return { status: CustomCommandStatus.Success, message: output };
        }

        if (!objective) {
            return { status: CustomCommandStatus.Failure, message: "Missing objective parameter" };
        }

        system.run(() => {
            const scoreboard =
                world.scoreboard.getObjective(objective) ??
                world.scoreboard.addObjective(objective);

            scoreboard.setScore(fakeplayer, elapsedTime);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `[${startId}] Set [${objective}] for ${fakeplayer} to ${elapsedTime}`,
        };
    }
);
