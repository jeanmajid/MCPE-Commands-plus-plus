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
        [ScoreOperation.Sqrt]: (num1: number): number => Math.sqrt(num1),
        [ScoreOperation.Cbrt]: (num1: number): number => Math.cbrt(num1),
        [ScoreOperation.Abs]: (num1: number): number => Math.abs(num1),
        [ScoreOperation.Acosh]: (num1: number): number => Math.acosh(num1),
        [ScoreOperation.Acos]: (num1: number): number => Math.acos(num1),
        [ScoreOperation.Cos]: (num1: number): number => Math.cos(num1),
        [ScoreOperation.Asinh]: (num1: number): number => Math.asinh(num1),
        [ScoreOperation.Asin]: (num1: number): number => Math.asin(num1),
        [ScoreOperation.Sin]: (num1: number): number => Math.sin(num1),
        [ScoreOperation.Atanh]: (num1: number): number => Math.atanh(num1),
        [ScoreOperation.Atan]: (num1: number): number => Math.atan(num1),
        [ScoreOperation.Tan]: (num1: number): number => Math.tan(num1),
        [ScoreOperation.Exp]: (num1: number): number => Math.exp(num1),
        [ScoreOperation.Expm1]: (num1: number): number => Math.expm1(num1),
        [ScoreOperation.Clz32]: (num1: number): number => Math.clz32(num1),
        [ScoreOperation.Log]: (num1: number): number => Math.log(num1),
        [ScoreOperation.Log10]: (num1: number): number => Math.log10(num1),
        [ScoreOperation.Log1p]: (num1: number): number => Math.log1p(num1),
        [ScoreOperation.Log2]: (num1: number): number => Math.log2(num1),
        [ScoreOperation.Sign]: (num1: number): number => Math.sign(num1),
        [ScoreOperation.Not]: (num1: number): number => ~num1,
    },
    {
        [ScoreOperation.Equals]: (_, num2: number): number => num2,
        [ScoreOperation.Add]: (num1: number, num2: number): number => num1 + num2,
        [ScoreOperation.Subtract]: (num1: number, num2: number): number => num1 - num2,
        [ScoreOperation.Multiply]: (num1: number, num2: number): number => num1 * num2,
        [ScoreOperation.Divide]: (num1: number, num2: number): number => num1 / num2,
        [ScoreOperation.Modulo]: (num1: number, num2: number): number => num1 % num2,
        [ScoreOperation.Min]: (num1: number, num2: number): number => Math.min(num1, num2),
        [ScoreOperation.Max]: (num1: number, num2: number): number => Math.max(num1, num2),
        [ScoreOperation.Swap]: (_num1: number, num2: number): number => num2,
        [ScoreOperation.Root]: (num1: number, num2: number): number => Math.pow(num1, 1 / num2),
        [ScoreOperation.Atan2]: (num1: number, num2: number): number => Math.atan2(num2, num1),
        [ScoreOperation.Hypot]: (num1: number, num2: number): number => Math.hypot(num1, num2),
        [ScoreOperation.Imul]: (num1: number, num2: number): number => Math.imul(num1, num2),
        [ScoreOperation.Pow]: (num1: number, num2: number): number => Math.pow(num1, num2),
        [ScoreOperation.ToFixed]: (num1: number, num2: number): number =>
            Number(num1.toFixed(num2)),
        [ScoreOperation.And]: (num1: number, num2: number): number => num1 & num2,
        [ScoreOperation.Or]: (num1: number, num2: number): number => num1 | num2,
        [ScoreOperation.Xor]: (num1: number, num2: number): number => num1 ^ num2,
        [ScoreOperation.LeftShift]: (num1: number, num2: number): number => num1 << num2,
        [ScoreOperation.RightShift]: (num1: number, num2: number): number => num1 >>> num2,
        [ScoreOperation.SignedRightShift]: (num1: number, num2: number): number => num1 >> num2,
    },
];
