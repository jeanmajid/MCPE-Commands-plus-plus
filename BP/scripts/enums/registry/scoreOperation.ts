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


import { EnumManager } from "../enum.js";

export const SCORE_OPERATION_ENUM_KEY = "scoreOperationEnum";
export enum ScoreOperation {
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

EnumManager.register(SCORE_OPERATION_ENUM_KEY, Object.values(ScoreOperation));
