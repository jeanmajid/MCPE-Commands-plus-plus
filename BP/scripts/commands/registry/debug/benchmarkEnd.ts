/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { benchmark_data } from "./benchmarkStart.js";
import { LOG_TYPE_ENUM_KEY, LogTypes, log } from "./log.js";

CommandManager.registerCommand(
    {
        name: "benchmarkend",
        description: "Logs the time since the benchmark started in milliseconds",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "startId", type: CustomCommandParamType.String }],
        optionalParameters: [
            { name: "logType", type: CustomCommandParamType.Enum, enumName: LOG_TYPE_ENUM_KEY },
        ],
    },
    (origin, startId: string, logType: string = LogTypes.info) => {
        if (!(startId in benchmark_data)) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Could not find a benchmark test with the start ID ${startId}`,
            };
        }

        const start = benchmark_data[startId];
        if (!start) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Benchmark with id not started",
            };
        }
        const elapsedTime = Date.now() - start;
        const output = `Elapsed ${elapsedTime}ms`;
        log(output, logType);

        return { status: CustomCommandStatus.Success, message: output };
    }
);
