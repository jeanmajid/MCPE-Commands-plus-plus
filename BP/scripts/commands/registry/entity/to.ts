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
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system,
} from "@minecraft/server";

import { FaceDirectionOffset } from "../../../constants/faceDirectionOffset.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

const SUCCESS_RESULT = {
    status: CustomCommandStatus.Success,
    message: "Sucessfully teleported entities",
};

CommandManager.register(
    {
        name: "to",
        description: "Teleports the target to the block they are facing at",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, targets: Entity[]) => {
        if (!targets) {
            if (!origin.sourceEntity) {
                return { status: CustomCommandStatus.Failure, message: "No targets provided" };
            }

            system.run(() => {
                tpToBlockFromViewDirection(origin.sourceEntity);
            });
            return SUCCESS_RESULT;
        } else if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                tpToBlockFromViewDirection(target);
            }
        });
        return SUCCESS_RESULT;
    }
);

export function tpToBlockFromViewDirection(target: Entity | undefined): undefined {
    if (!target || !target.isValid) {
        return;
    }

    const intersection = target.getBlockFromViewDirection();
    if (!intersection) {
        return;
    }

    const { face, faceLocation, block } = intersection;
    const blockLocation = Vector.add(faceLocation, block.location);
    const destination = Vector.add(blockLocation, FaceDirectionOffset[face]);
    target.teleport(destination);
}
