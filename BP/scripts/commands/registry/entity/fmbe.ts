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
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    Entity,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

export const FMBE_TYPE_ENUM_KEY = "fmbeTypeEnum";
enum FmbeTypes {
    standard = "standard",
    simple = "simple",
    advanced2d = "advanced_2d",
    advanced3d = "advanced_3d",
    advancedItems = "advanced_items",
}

CommandManager.registerEnum(FMBE_TYPE_ENUM_KEY, Object.values(FmbeTypes));

CommandManager.registerCommand(
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
    (origin, targets: Entity[], fmbeType: FmbeTypes = FmbeTypes.standard) => {
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
