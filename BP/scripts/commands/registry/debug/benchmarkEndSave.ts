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
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { benchmark_data } from "./benchmarkStart.js";

CommandManager.registerCommand(
    {
        name: "benchmarkendsave",
        description:
            "Saves the time since the benchmark started in milliseconds to a scoreboard objective on a fakeplayer",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "startId", type: CustomCommandParamType.String },
            { name: "fakeplayer", type: CustomCommandParamType.String },
            { name: "objective", type: CustomCommandParamType.String },
        ],
    },
    (origin, startId: string, fakeplayer: string, objective: string) => {
        const start = benchmark_data[startId];
        if (!start) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Could not find a benchmark test with the start ID ${startId}`,
            };
        }

        const scoreboard =
            world.scoreboard.getObjective(objective) ?? world.scoreboard.addObjective(objective);
        const elapsedTime = Date.now() - start;

        scoreboard.setScore(fakeplayer, elapsedTime);

        return {
            status: CustomCommandStatus.Success,
            message: `Set [${objective}] for ${fakeplayer} to ${elapsedTime}`,
        };
    }
);
