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
import { clamp } from "../../../utils/math.js";
import { getScoreboardObjective } from "../../../utils/score.js";
import { CommandManager } from "../../command.js";

const SCORE_OPERATIONS_ENUM_KEY = "scoreOperationsEnum";
export enum ScoreOperations {
    equals = "equals",
    add = "add",
    subtract = "subtract",
    multiply = "multiply",
    divide = "divide",
    modulo = "modulo",
    min = "min",
    max = "max",
    swap = "swap",
    sqrt = "sqrt",
    cbrt = "cbrt",
    root = "root",
    abs = "abs",
    acosh = "acosh",
    acos = "acos",
    cos = "cos",
    asinh = "asinh",
    asin = "asin",
    sin = "sin",
    atan2 = "atan2",
    atanh = "atanh",
    atan = "atan",
    tan = "tan",
    exp = "exp",
    expm1 = "expm1",
    clz32 = "clz32",
    hypot = "hypot",
    imul = "imul",
    log = "log",
    log10 = "log10",
    log1p = "log1p",
    log2 = "log2",
    pow = "pow",
    toFixed = "tofixed",
    sign = "sign",
    and = "and",
    or = "or",
    xor = "xor",
    not = "not",
    leftShift = "<<",
    rightShift = ">>>",
    signedRightShift = ">>",
}

CommandManager.registerEnum(SCORE_OPERATIONS_ENUM_KEY, Object.values(ScoreOperations));

const SUCCESS = {
    status: CustomCommandStatus.Success,
    message: "Successfully updated targets scores",
};

CommandManager.registerCommand(
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
                enumName: SCORE_OPERATIONS_ENUM_KEY,
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
        [ScoreOperations.sqrt]: (num1: number): number => Math.sqrt(num1),
        [ScoreOperations.cbrt]: (num1: number): number => Math.cbrt(num1),
        [ScoreOperations.abs]: (num1: number): number => Math.abs(num1),
        [ScoreOperations.acosh]: (num1: number): number => Math.acosh(num1),
        [ScoreOperations.acos]: (num1: number): number => Math.acos(num1),
        [ScoreOperations.cos]: (num1: number): number => Math.cos(num1),
        [ScoreOperations.asinh]: (num1: number): number => Math.asinh(num1),
        [ScoreOperations.asin]: (num1: number): number => Math.asin(num1),
        [ScoreOperations.sin]: (num1: number): number => Math.sin(num1),
        [ScoreOperations.atanh]: (num1: number): number => Math.atanh(num1),
        [ScoreOperations.atan]: (num1: number): number => Math.atan(num1),
        [ScoreOperations.tan]: (num1: number): number => Math.tan(num1),
        [ScoreOperations.exp]: (num1: number): number => Math.exp(num1),
        [ScoreOperations.expm1]: (num1: number): number => Math.expm1(num1),
        [ScoreOperations.clz32]: (num1: number): number => Math.clz32(num1),
        [ScoreOperations.log]: (num1: number): number => Math.log(num1),
        [ScoreOperations.log10]: (num1: number): number => Math.log10(num1),
        [ScoreOperations.log1p]: (num1: number): number => Math.log1p(num1),
        [ScoreOperations.log2]: (num1: number): number => Math.log2(num1),
        [ScoreOperations.sign]: (num1: number): number => Math.sign(num1),
        [ScoreOperations.not]: (num1: number): number => ~num1,
    },
    {
        [ScoreOperations.equals]: (_, num2: number): number => num2,
        [ScoreOperations.add]: (num1: number, num2: number): number => num1 + num2,
        [ScoreOperations.subtract]: (num1: number, num2: number): number => num1 - num2,
        [ScoreOperations.multiply]: (num1: number, num2: number): number => num1 * num2,
        [ScoreOperations.divide]: (num1: number, num2: number): number => num1 / num2,
        [ScoreOperations.modulo]: (num1: number, num2: number): number => num1 % num2,
        [ScoreOperations.min]: (num1: number, num2: number): number => Math.min(num1, num2),
        [ScoreOperations.max]: (num1: number, num2: number): number => Math.max(num1, num2),
        [ScoreOperations.swap]: (_num1: number, num2: number): number => num2,
        [ScoreOperations.root]: (num1: number, num2: number): number => Math.pow(num1, 1 / num2),
        [ScoreOperations.atan2]: (num1: number, num2: number): number => Math.atan2(num2, num1),
        [ScoreOperations.hypot]: (num1: number, num2: number): number => Math.hypot(num1, num2),
        [ScoreOperations.imul]: (num1: number, num2: number): number => Math.imul(num1, num2),
        [ScoreOperations.pow]: (num1: number, num2: number): number => Math.pow(num1, num2),
        [ScoreOperations.toFixed]: (num1: number, num2: number): number =>
            Number(num1.toFixed(num2)),
        [ScoreOperations.and]: (num1: number, num2: number): number => num1 & num2,
        [ScoreOperations.or]: (num1: number, num2: number): number => num1 | num2,
        [ScoreOperations.xor]: (num1: number, num2: number): number => num1 ^ num2,
        [ScoreOperations.leftShift]: (num1: number, num2: number): number => num1 << num2,
        [ScoreOperations.rightShift]: (num1: number, num2: number): number => num1 >>> num2,
        [ScoreOperations.signedRightShift]: (num1: number, num2: number): number => num1 >> num2,
    },
];
