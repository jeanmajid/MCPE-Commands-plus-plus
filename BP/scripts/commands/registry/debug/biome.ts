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
    BiomeType,
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const BIOME_DATA_ENUM_KEY = "biomeDataEnum";
enum BiomeData {
    all = "all",
    tags = "tags",
    id = "id",
}

CommandManager.registerEnum(BIOME_DATA_ENUM_KEY, Object.values(BiomeData));

CommandManager.registerCommand(
    {
        name: "biome",
        description: "Outputs the data for the biome based on the position of the executor",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "biomeData", type: CustomCommandParamType.Enum, enumName: BIOME_DATA_ENUM_KEY },
        ],
    },
    (origin, biomeData: BiomeData = BiomeData.id) => {
        const source = origin.sourceEntity ?? origin.sourceBlock ?? origin.initiator;
        if (!source || !source.dimension.isChunkLoaded(source.location)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Cannot get biome data outside of the world",
            };
        }

        const biome = source.dimension.getBiome(source.location);
        if (biomeData === BiomeData.id) {
            return { status: CustomCommandStatus.Success, message: `§aBiome: §r${biome.id}` };
        }
        if (biomeData === BiomeData.tags) {
            return {
                status: CustomCommandStatus.Success,
                message: `§aTags: §r${getBiomeTags(biome)}`,
            };
        }
        return {
            status: CustomCommandStatus.Success,
            message: `§aBiome: §r${biome.id}\n§aTags: §r${getBiomeTags(biome)}`,
        };
    }
);

function getBiomeTags(biome: BiomeType): string {
    return biome.getTags().join(", ");
}
