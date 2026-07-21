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
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "block",
        description: "Places a block at the current position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [{ name: "blockType", type: CustomCommandParamType.BlockType }],
    },
    (origin, blockType: string = "minecraft:glass") => {
        if (!origin.sourceEntity) {
            return;
        }
        const dimension = origin.sourceEntity.dimension;
        const location = origin.sourceEntity.location;
        system.run(() => {
            dimension.setBlockType(location, blockType);
        });
        return {
            status: CustomCommandStatus.Success,
            message: `${blockType} placed successully at ${Vector.toStringFloored(location)}`,
        };
    }
);
