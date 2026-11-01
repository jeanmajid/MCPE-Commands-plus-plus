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

import { Node } from "./node/node.js";
import { NodePath } from "./node/nodePath.js";
import { NodeType } from "./node/nodeType.js";
import { BracketPair, NodeObject, SyntaxNodeType } from "./types.js";

// TEMPORARY LITERAL TABLE FOR TESTING
const stringLiterals: Record<string, number> = { score: 1 };

export class CommandRunner {
    private static rootNode: Node = new Node(SyntaxNodeType.Root);

    public static run(command: string): void {
        const bracketPairs = this.extractBracketPairs(command);
        if (bracketPairs === null) {
            return;
        }

        this.parseBrackets(command, bracketPairs);
    }

    public static registerSyntax(syntax: NodePath): void {
        let current: Node = this.rootNode;
        for (const path of syntax.path) {
            let node = current.getChild(path);
            if (!node) {
                node = new Node(path);
            }

            current.addChild(node);
            current = node;
        }

        current.action = syntax.action;
    }

    private static parseBrackets(command: string, bracketPairs: BracketPair[]): void {
        for (let i = bracketPairs.length - 1; i >= 0; --i) {
            const pair = bracketPairs[i];

            const bracketContents = command.slice(pair.start + 1, pair.end);

            const _result = this.parseExpression(bracketContents);
        }
    }

    private static parseExpression(expression: string): string {
        const parts = expression.split(".");

        const results = this.tryParseExpressions(parts);

        let currentNode = this.rootNode;
        for (const result of results) {
            const newNode = currentNode.getChild(result.type);
            if (!newNode) {
                // TODO BETTER ERROR HANDLING PLEASE
                return "INVALID SYNTAX";
            }

            currentNode = newNode;
        }
    }

    private static tryParseExpressions(expressions: string[]): NodeObject[] {
        const returnValues = [];

        for (const expression of expressions) {
            const returnNode: NodeObject = {
                type: this.getExpressionType(expression),
                value: expression,
            };

            const parser = NodeType.getParser(returnNode.type);
            if (!parser) {
                console.error(`Missing parser for type: ${SyntaxNodeType[returnNode.type]}`);
                returnValues.push(returnNode);
                continue;
            }

            const parsedExpression = parser(expression);

            returnNode.value = parsedExpression;

            returnValues.push(returnNode);
        }

        return returnValues;
    }

    private static getExpressionType(expression: string): SyntaxNodeType {
        if (expression.startsWith("@")) {
            return SyntaxNodeType.Selector;
        } else if (!isNaN(Number(expression))) {
            return SyntaxNodeType.Number;
        } else if (stringLiterals[expression]) {
            return SyntaxNodeType.Literal;
        } else {
            return SyntaxNodeType.String;
        }
    }

    private static extractBracketPairs(command: string): BracketPair[] | null {
        const bracketPairs: BracketPair[] = [];
        const openPairIndexes: number[] = [];
        let pointer = 0;
        let error = false;

        while (pointer < command.length) {
            const openingBracket = command.indexOf("{", pointer);
            const closingBracket = command.indexOf("}", pointer);

            if (openingBracket === -1 && closingBracket === -1) {
                break;
            }

            if (
                openingBracket !== -1 &&
                (closingBracket === -1 || openingBracket < closingBracket)
            ) {
                openPairIndexes.push(bracketPairs.length);
                bracketPairs.push({ start: openingBracket, end: -1 });
                pointer = openingBracket + 1;
                continue;
            }

            const pairIndex = openPairIndexes.pop();

            if (pairIndex === undefined) {
                console.error(`Unexpected closing bracket at index ${closingBracket}`);
                error = true;
                pointer = closingBracket + 1;
                continue;
            }

            bracketPairs[pairIndex].end = closingBracket;
            pointer = closingBracket + 1;
        }

        for (const pairIndex of openPairIndexes) {
            error = true;
            console.error(`Missing closing bracket for index ${bracketPairs[pairIndex].start}`);
        }

        return error ? null : bracketPairs;
    }
}
