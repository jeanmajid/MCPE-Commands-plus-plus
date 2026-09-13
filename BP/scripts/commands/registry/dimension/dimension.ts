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
    Entity,
    system,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { CommandManager } from "../../command.js";

CommandManager.registerEnum(
    "dimension",
    Object.keys({ ...Dimensions }).filter((d) => d !== "all")
);

CommandManager.registerCommand(
    {
        name: "dimension",
        description: "Teleport between dimensions",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "dimension", type: CustomCommandParamType.Enum, enumName: "dimension" },
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
