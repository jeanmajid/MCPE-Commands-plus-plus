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
    CustomCommandParamType,
    world,
    system,
} from "@minecraft/server";

import { AttributeManager } from "../../../attributes/attribute.js";
import { ATTRIBUTE_KEY } from "../../../constants/dynamicPropertyKeys.js";
import { CommandManager } from "../../command.js";

CommandManager.registerEnum("bind", ["health"]);

CommandManager.registerCommand(
    {
        name: "bind",
        description: "Bind an attribute to a score",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "bindtype", type: CustomCommandParamType.Enum, enumName: "bind" },
            { name: "scoreboardId", type: CustomCommandParamType.String },
        ],
    },
    (origin, attributeId: string, scoreboardId: string) => {
        const attribute = AttributeManager.getAttribute(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`,
            };
        }
        if (attribute.isBinded) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} is already binded to ${attribute.score.id}`,
            };
        }

        system.run(() => {
            world.setDynamicProperty(`${ATTRIBUTE_KEY}${attributeId}`, scoreboardId);
            const objective =
                world.scoreboard.getObjective(scoreboardId) ||
                world.scoreboard.addObjective(scoreboardId);

            attribute.isBinded = true;
            attribute.score = objective;
            attribute.initialize();
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully binded ${attributeId} to score ${scoreboardId}`,
        };
    }
);
