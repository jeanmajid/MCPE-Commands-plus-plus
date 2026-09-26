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
    Entity,
    system,
} from "@minecraft/server";

import { MAX_SIGNED_INT32, MIN_SIGNED_INT32 } from "../../../constants/integer.js";
import {
    SCORE_OPERATION_ENUM_KEY,
    ScoreOperation,
} from "../../../enums/registry/scoreOperation.js";
import { clamp } from "../../../utils/math.js";
import { getScoreboardObjective } from "../../../utils/score.js";
import { CommandManager } from "../../command.js";

const SUCCESS = {
    status: CustomCommandStatus.Success,
    message: "Successfully updated targets scores",
};

CommandManager.register(
    {
        name: "scoremath",
        description:
            "Performs a calculation with the selected operation between the scores of two targets",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "targetObjective", type: CustomCommandParamType.String },
            {
                name: "operation",
                type: CustomCommandParamType.Enum,
                enumName: SCORE_OPERATION_ENUM_KEY,
            },
        ],
        optionalParameters: [
            { name: "selectors", type: CustomCommandParamType.EntitySelector },
            { name: "objective", type: CustomCommandParamType.String },
        ],
    },
    (
        origin,
        targets: Entity[],
        targetObjective: string,
        operation: string,
        selectors: Entity[],
        objective: string
    ) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        if (selectors) {
            if (selectors.length === 0) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "No targets match selector",
                };
            }

            const callback = operations[1][operation];
            system.run(() => {
                const objective1 = getScoreboardObjective(targetObjective);
                const objective2 = getScoreboardObjective(objective);

                for (const target1 of targets) {
                    if (!target1.isValid || !target1.scoreboardIdentity) {
                        continue;
                    }

                    const score1 = objective1.getScore(target1);
                    if (score1 === undefined) {
                        continue;
                    }

                    for (const target2 of selectors) {
                        if (!target2.isValid || !target2.scoreboardIdentity) {
                            continue;
                        }

                        const score2 = objective2.getScore(target2);
                        if (score2 === undefined) {
                            continue;
                        }

                        const result = clamp(
                            callback(score1, score2),
                            MIN_SIGNED_INT32,
                            MAX_SIGNED_INT32
                        );
                        objective1.setScore(target1, result);
                    }
                }
            });
            return SUCCESS;
        }

        const callback = operations[0][operation];
        system.run(() => {
            const objective1 = getScoreboardObjective(targetObjective);

            for (const target of targets) {
                if (!target.isValid || !target.scoreboardIdentity) {
                    continue;
                }

                const score = objective1.getScore(target);
                if (score === undefined) {
                    continue;
                }

                const result = clamp(callback(score), MIN_SIGNED_INT32, MAX_SIGNED_INT32); // add a custom gamerule to /config that determines whether these should clamp or overflow

                objective1.setScore(target, result);
            }
        });
        return SUCCESS;
    }
);

type UnaryScoreOperation = (value: number) => number;
type BinaryScoreOperation = (left: number, right: number) => number;

export const operations: [
    Record<string, UnaryScoreOperation>,
    Record<string, BinaryScoreOperation>,
] = [
    {
        [ScoreOperation.sqrt]: (num1: number): number => Math.sqrt(num1),
        [ScoreOperation.cbrt]: (num1: number): number => Math.cbrt(num1),
        [ScoreOperation.abs]: (num1: number): number => Math.abs(num1),
        [ScoreOperation.acosh]: (num1: number): number => Math.acosh(num1),
        [ScoreOperation.acos]: (num1: number): number => Math.acos(num1),
        [ScoreOperation.cos]: (num1: number): number => Math.cos(num1),
        [ScoreOperation.asinh]: (num1: number): number => Math.asinh(num1),
        [ScoreOperation.asin]: (num1: number): number => Math.asin(num1),
        [ScoreOperation.sin]: (num1: number): number => Math.sin(num1),
        [ScoreOperation.atanh]: (num1: number): number => Math.atanh(num1),
        [ScoreOperation.atan]: (num1: number): number => Math.atan(num1),
        [ScoreOperation.tan]: (num1: number): number => Math.tan(num1),
        [ScoreOperation.exp]: (num1: number): number => Math.exp(num1),
        [ScoreOperation.expm1]: (num1: number): number => Math.expm1(num1),
        [ScoreOperation.clz32]: (num1: number): number => Math.clz32(num1),
        [ScoreOperation.log]: (num1: number): number => Math.log(num1),
        [ScoreOperation.log10]: (num1: number): number => Math.log10(num1),
        [ScoreOperation.log1p]: (num1: number): number => Math.log1p(num1),
        [ScoreOperation.log2]: (num1: number): number => Math.log2(num1),
        [ScoreOperation.sign]: (num1: number): number => Math.sign(num1),
        [ScoreOperation.not]: (num1: number): number => ~num1,
    },
    {
        [ScoreOperation.equals]: (_, num2: number): number => num2,
        [ScoreOperation.add]: (num1: number, num2: number): number => num1 + num2,
        [ScoreOperation.subtract]: (num1: number, num2: number): number => num1 - num2,
        [ScoreOperation.multiply]: (num1: number, num2: number): number => num1 * num2,
        [ScoreOperation.divide]: (num1: number, num2: number): number => num1 / num2,
        [ScoreOperation.modulo]: (num1: number, num2: number): number => num1 % num2,
        [ScoreOperation.min]: (num1: number, num2: number): number => Math.min(num1, num2),
        [ScoreOperation.max]: (num1: number, num2: number): number => Math.max(num1, num2),
        [ScoreOperation.swap]: (_num1: number, num2: number): number => num2,
        [ScoreOperation.root]: (num1: number, num2: number): number => Math.pow(num1, 1 / num2),
        [ScoreOperation.atan2]: (num1: number, num2: number): number => Math.atan2(num2, num1),
        [ScoreOperation.hypot]: (num1: number, num2: number): number => Math.hypot(num1, num2),
        [ScoreOperation.imul]: (num1: number, num2: number): number => Math.imul(num1, num2),
        [ScoreOperation.pow]: (num1: number, num2: number): number => Math.pow(num1, num2),
        [ScoreOperation.toFixed]: (num1: number, num2: number): number =>
            Number(num1.toFixed(num2)),
        [ScoreOperation.and]: (num1: number, num2: number): number => num1 & num2,
        [ScoreOperation.or]: (num1: number, num2: number): number => num1 | num2,
        [ScoreOperation.xor]: (num1: number, num2: number): number => num1 ^ num2,
        [ScoreOperation.leftShift]: (num1: number, num2: number): number => num1 << num2,
        [ScoreOperation.rightShift]: (num1: number, num2: number): number => num1 >>> num2,
        [ScoreOperation.signedRightShift]: (num1: number, num2: number): number => num1 >> num2,
    },
];
