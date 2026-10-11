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
