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
    Vector3,
    ItemStack,
    ItemType,
    system,
} from "@minecraft/server";

import { clamp } from "../../../utils/clamp.js";
import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "spawnitem",
        description: "Summons an item entity",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "item", type: CustomCommandParamType.ItemType },
            { name: "location", type: CustomCommandParamType.Location },
        ],
        optionalParameters: [{ name: "quantity", type: CustomCommandParamType.Integer }],
    },
    (origin, item: ItemType, location: Vector3, quantity: number = 1) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        quantity = clamp(quantity, 1, 255);

        const itemStack = new ItemStack(item, quantity);

        system.run(() => {
            try {
                dimension.spawnItem(itemStack, location);
            } catch {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot spawn item outside of the world",
                };
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Summoned %${item.localizationKey} * ${quantity}`,
        };
    }
);
