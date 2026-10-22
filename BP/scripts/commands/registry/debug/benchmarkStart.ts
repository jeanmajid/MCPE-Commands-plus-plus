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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

export const benchmark_data: Record<string, number> = {};

CommandManager.register(
    {
        name: "benchmarkstart",
        description:
            "Creates a time checkpoint used to find the time commands have taken to run using /benchmarkend",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "id", type: CustomCommandParamType.String }],
    },
    (_, id: string) => {
        benchmark_data[id] = Date.now();
        return {
            status: CustomCommandStatus.Success,
            message: `Began benchmark with the ID "${id}"`,
        };
    }
);
