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

import { CommandRunner } from "../commandRunner.js";
import { Node } from "../node.js";
import { NodePath } from "../nodePath.js";
import { SyntaxNodeType } from "../types.js";

const nameSyntaxSelector = new Node(SyntaxNodeType.Selector);
const nameSyntaxString = new Node(SyntaxNodeType.String);
nameSyntaxSelector.addChild(nameSyntaxString);

// @s.string -> path
// @s.string.string -> path

const path1 = new NodePath();
path1.addNode(nameSyntaxSelector);
path1.addNode(nameSyntaxString);
path1.addAction(() => {
    console.log("bombo");
});

CommandRunner.registerSyntax(path1);

// (selector: Entity[], string: string) => {
//     asdasdasd
// }

// (selector: Entity[], string: string, string2: string) => {
//     asdasdasd
// }
