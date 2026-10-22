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
    BiomeType,
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
} from "@minecraft/server";

import { BIOME_DATA_ENUM_KEY, BiomeData } from "../../../enums/registry/biomeData.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "biome",
        description: "Outputs the data for the biome based on the position of the executor",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "biomeData", type: CustomCommandParamType.Enum, enumName: BIOME_DATA_ENUM_KEY },
        ],
    },
    (origin, biomeData: BiomeData = BiomeData.Id) => {
        const source = origin.sourceEntity ?? origin.sourceBlock ?? origin.initiator;
        if (!source || !source.dimension.isChunkLoaded(source.location)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Cannot get biome data outside of the world",
            };
        }

        const biome = source.dimension.getBiome(source.location);
        if (biomeData === BiomeData.Id) {
            return { status: CustomCommandStatus.Success, message: `§aBiome: §r${biome.id}` };
        }
        if (biomeData === BiomeData.Tags) {
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
