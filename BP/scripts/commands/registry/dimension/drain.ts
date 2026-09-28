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

// TODO: Target location, default to origin location
// TODO: Get rid of the logging
// TODO: Needs some refactoring
// TODO: Waterlogged blocks need to be unwaterlogged

import {
    Block,
    BlockPermutation,
    BlockType,
    BlockTypes,
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandStatus,
    Dimension,
    ListBlockVolume,
    system,
    Vector3,
    world,
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "drain",
        description: "Drains either lava or water around the player with a radius.",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
        optionalParameters: [
            { name: "radius", type: CustomCommandParamType.Integer },
            { name: "includeWaterLogged", type: CustomCommandParamType.Boolean },
            { name: "fill", type: CustomCommandParamType.BlockType },
        ],
    },
    (
        origin: CustomCommandOrigin,
        radius: number = 16,
        waterLogged: boolean = false,
        fill: BlockType = BlockTypes.get("minecraft:air")!
    ) => {
        if (radius > 128 || radius < 1) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Radius has to be in the range of 1 to 128",
            };
        }

        const dimension: Dimension = origin.sourceEntity!.dimension;
        const playerPos: Vector3 = origin.sourceEntity!.location;

        const entry = dimension.getBlock(playerPos);
        if (!entry!.isLiquid) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Player doesn't stands in liquid`,
            };
        }

        function* process(): Generator<void, void, void> {
            const chunks: Map<string, Vector3[]> = new Map();
            let blocks = 0;
            let lastTick = system.currentTick >> 4;
            const filter = new Set([entry!.permutation, entry!.type]);

            for (const block of fluidMarshal(
                (b): boolean =>
                    filter.has(b.type) ||
                    filter.has(b.permutation) ||
                    (waterLogged && (b.isWaterlogged || b.typeId === "minecraft:bubble_column")),
                entry!,
                radius ?? 64
            )) {
                const chunkLocation = Vector.floor(Vector.multiply(block, 1 / 16));
                // We want to sort them by Y level
                const chunkId = `${chunkLocation.y.toString(16).padStart(4, "0")}${chunkLocation.x.toString(16).padStart(4, "0")}${chunkLocation.z.toString(16).padStart(4, "0")}`;

                let list = chunks.get(chunkId) ?? null;
                if (!list) {
                    chunks.set(chunkId, (list = []));
                }

                yield void list.push(block.location);
                ++blocks;

                if (lastTick !== system.currentTick >> 4) {
                    lastTick = system.currentTick >> 4;
                    world.sendMessage("§hCalculating effected blocks: " + blocks);
                }
            }
            world.sendMessage(`§hFilling ${blocks} blocks.`);

            const bedrock = BlockPermutation.resolve("bedrock");
            for (const chunk_keys of Array.from(chunks.keys()).sort()) {
                const chunk = chunks.get(chunk_keys)!;
                const raw = new ListBlockVolume(chunk);
                try {
                    if (waterLogged) {
                        // somehow waterlogged items do not removed the logged flag
                        yield void dimension.fillBlocks(raw, bedrock);
                    }

                    yield void dimension.fillBlocks(raw, fill);
                } catch {}
            }
        }

        system.runJob(process());
        return {
            status: CustomCommandStatus.Success,
            message: `Successfully started drained job with in a ${radius} block radius.`,
        };
    }
);

function* fluidMarshal(
    select: (block: Block) => boolean,
    entry: Block,
    maxRadius: number
): Generator<Block> {
    const center = entry.location;
    const stack: (Block | undefined)[] = [entry];
    const processed: Set<string> = new Set();

    maxRadius = maxRadius * maxRadius; // power
    while (stack.length) {
        const current = stack.pop();
        if (!current) {
            continue;
        }

        const hash = Vector.toStringFlooredHash(current);

        if (processed.has(hash)) {
            continue;
        }

        processed.add(hash);

        if (!current.isValid || Vector.powerDistance(center, current) > maxRadius) {
            continue;
        }

        if (!select(current)) {
            continue;
        }

        for (const offset of [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
        ] satisfies Vector3[]) {
            try {
                stack.push(current.offset(offset));
            } catch {}
        }

        yield current;
    }
}
