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
    Entity,
    system,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { DIMENSION_ENUM_KEY } from "../../../enums/registry/dimension.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "dimension",
        description: "Teleport between dimensions",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "dimension", type: CustomCommandParamType.Enum, enumName: DIMENSION_ENUM_KEY },
        ],
        optionalParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, dimension: keyof typeof Dimensions, targets?: Entity[]) => {
        const targetDimension = Dimensions[dimension];
        if (!targetDimension || Array.isArray(targetDimension)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid dimension identifier" };
        }

        if (!targets && origin.sourceEntity) {
            targets = [origin.sourceEntity];
        }

        if (!targets || targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                target.teleport(target.location, { dimension: targetDimension });
            }
        });
        return { status: CustomCommandStatus.Success, message: `Successfully created explosion` };
    }
);
