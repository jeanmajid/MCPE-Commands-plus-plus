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

import { EnumManager } from "../enum.js";

export const SCORE_OPERATION_ENUM_KEY = "scoreOperationEnum";
export enum ScoreOperation {
    Equals = "equals",
    Add = "add",
    Subtract = "subtract",
    Multiply = "multiply",
    Divide = "divide",
    Modulo = "modulo",
    Min = "min",
    Max = "max",
    Swap = "swap",
    Sqrt = "sqrt",
    Cbrt = "cbrt",
    Root = "root",
    Abs = "abs",
    Acosh = "acosh",
    Acos = "acos",
    Cos = "cos",
    Asinh = "asinh",
    Asin = "asin",
    Sin = "sin",
    Atan2 = "atan2",
    Atanh = "atanh",
    Atan = "atan",
    Tan = "tan",
    Exp = "exp",
    Expm1 = "expm1",
    Clz32 = "clz32",
    Hypot = "hypot",
    Imul = "imul",
    Log = "log",
    Log10 = "log10",
    Log1p = "log1p",
    Log2 = "log2",
    Pow = "pow",
    ToFixed = "tofixed",
    Sign = "sign",
    And = "and",
    Or = "or",
    Xor = "xor",
    Not = "not",
    LeftShift = "<<",
    RightShift = ">>>",
    SignedRightShift = ">>",
}

EnumManager.register(SCORE_OPERATION_ENUM_KEY, Object.values(ScoreOperation));
