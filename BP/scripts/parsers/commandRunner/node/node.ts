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

import { SyntaxNodeType } from "../types.js";

export class Node {
    public type: SyntaxNodeType;
    public branches: Map<number, Node> = new Map();
    public action: (() => void) | null = null;

    public constructor(type: SyntaxNodeType) {
        this.type = type;
    }

    public addChild(node: Node): void {
        this.branches.set(node.type, node);
    }

    public getChild(type: SyntaxNodeType): Node | undefined {
        return this.branches.get(type);
    }
}
