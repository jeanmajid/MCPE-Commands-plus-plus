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
    Entity,
} from "@minecraft/server";

import { FMBE_TYPE_ENUM_KEY, FmbeType } from "../../../enums/registry/fmbeType.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "fmbe",
        description:
            "Animates targets (fox) to appear as a full block when holding a three dimensional block item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "entities", type: CustomCommandParamType.EntitySelector }],
        optionalParameters: [
            { name: "fmbeType", type: CustomCommandParamType.Enum, enumName: FMBE_TYPE_ENUM_KEY },
        ],
    },
    (origin, targets: Entity[], fmbeType: FmbeType = FmbeType.Standard) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                target.runCommand(`function fmbe/${fmbeType}_setup`);
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: "Requested animations on target entities",
        };
    }
);
