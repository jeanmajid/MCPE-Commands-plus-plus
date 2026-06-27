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

import { CommandManager } from "../command.js";
import { AttributeManager } from "./../../attributes/attribute";

CommandManager.registerCommand(
    {
        name: "unbind",
        description: "unbind an attribute",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        // TODO: get rid off jeanmajid: here and automate
        mandatoryParameters: [{ name: "jeanmajid:bind", type: CustomCommandParamType.Enum }],
    },
    (origin, attributeId: string) => {
        const attribute = AttributeManager.getAttribute(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`,
            };
        }
        if (!attribute.isBinded) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} isn't binded`,
            };
        }

        system.run(() => {
            world.setDynamicProperty(`attribute:${attributeId}`, undefined);
            attribute.cleanup();
            world.scoreboard.removeObjective(attribute.score);

            attribute.isBinded = false;
            // @ts-expect-error
            attribute.score = undefined;
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully unbinded ${attributeId}`,
        };
    }
);
