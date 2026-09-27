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
	BlockVolume,
	CommandPermissionLevel,
	CustomCommandOrigin,
	CustomCommandParamType,
	CustomCommandStatus, Dimension,
	system,
	Vector3,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { LiquidType, LIQUIDTYPE_ENUM_KEY} from "../../../enums/registry/liquidType.js";

function isInSphere(center: Vector3, position: Vector3, radius: number): boolean {
	const dx: number = position.x - center.x;
	const dy: number = position.y - center.y;
	const dz: number = position.z - center.z;

	return dx * dx + dy * dy + dz * dz > radius * radius;
}

CommandManager.register({
        name: "drain",
        description: "Drains either lava or water around the player with a radius.",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "liquidType", type: CustomCommandParamType.Enum, enumName: LIQUIDTYPE_ENUM_KEY },
        ],
		optionalParameters: [
			{ name: "radius", type: CustomCommandParamType.Integer },
		]
    },
    (origin: CustomCommandOrigin, liquidType: LiquidType, radius: number = 5) => {
		const dimension: Dimension = origin.sourceEntity.dimension;
		
		const center: Vector3 = origin.sourceEntity.location
		const min = {x: center.x - radius, y: center.y - radius, z: center.z - radius}
		const max = {x: center.x + radius, y: center.y + radius, z: center.z + radius}
		
		const volume = new BlockVolume(min, max)
		
        system.run(() => {
			for (const location of volume.getBlockLocationIterator()) {
				if (!dimension.isChunkLoaded(location)) continue
				if (!isInSphere(center, location, radius)) continue
				
				const block = dimension.getBlock(location);
				
				switch (liquidType) {
					case LiquidType.lava:
						if (block?.typeId === "minecraft:lava") {
							block.setType("minecraft:air");
						}
						
						break
					
					case LiquidType.water:
						if (block?.typeId === "minecraft:water") {
							block.setType("minecraft:air");
						}
						
						break
				}
			}
        });
		
        return { status: CustomCommandStatus.Success, message: `Successfully drained ${liquidType.toString()} in a ${radius.toString()} block radius.` };
    }
);
