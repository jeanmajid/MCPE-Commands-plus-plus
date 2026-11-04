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

import { CustomCommandOrigin } from "@minecraft/server";

import { Node } from "./node/node.js";
import { NodePath } from "./node/nodePath.js";
import { NodeType } from "./node/nodeType.js";
import { BracketPair, NodeObject, SyntaxNodeType, SyntaxNodeTypeEnum } from "./types.js";

export class CommandRunner {
    private static rootNode: Node = new Node(SyntaxNodeTypeEnum.Root);
    private static stringLiterals: Set<SyntaxNodeType> = new Set();

    public static run(commandOrigin: CustomCommandOrigin, command: string): void {
        const bracketPairs = this.extractBracketPairs(command);
        if (bracketPairs === null) {
            return;
        }

        const parsedCommand = this.parseCommand(commandOrigin, command, bracketPairs);

        console.log(parsedCommand);
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

            if (typeof current.type === "string") {
                this.stringLiterals.add(current.type);
            }
        }

        current.action = syntax.action;
    }

    private static parseCommand(
        commandOrigin: CustomCommandOrigin,
        command: string,
        bracketPairs: BracketPair[]
    ): string {
        const stringBuilder = [];
        let lastEndIndex = 0;

        // TODO GOING FORWARD, NOT SUPPORTING NESTED SYNTAX FOR NOW
        for (const pair of bracketPairs) {
            stringBuilder.push(command.slice(lastEndIndex, pair.start));

            const bracketContents = command.slice(pair.start + 1, pair.end);
            const result = this.parseExpression(commandOrigin, bracketContents);
            stringBuilder.push(result);

            lastEndIndex = pair.end + 1;
        }
        stringBuilder.push(command.slice(lastEndIndex, command.length));

        return stringBuilder.join("");
    }

    private static parseExpression(commandOrigin: CustomCommandOrigin, expression: string): string {
        const parts = expression.split(".");

        const results = this.tryParseExpressions(commandOrigin, parts);

        let currentNode = this.rootNode;
        for (const result of results) {
            const newNode = currentNode.getChild(result.type);
            if (!newNode) {
                // TODO BETTER ERROR HANDLING PLEASE
                return "INVALID SYNTAX";
            }

            currentNode = newNode;
        }

        if (!currentNode.action) {
            return "NO VALID END PATH";
        }

        return currentNode.action(commandOrigin, ...results.map((n) => n.value));
    }

    private static tryParseExpressions(
        commandOrigin: CustomCommandOrigin,
        expressions: string[]
    ): NodeObject[] {
        const returnValues = [];

        for (const expression of expressions) {
            const returnNode: NodeObject = {
                type: this.getExpressionType(expression),
                value: expression,
            };

            const parser = NodeType.getParser(returnNode.type);
            if (!parser) {
                console.error(`Missing parser for type: ${returnNode.type}`);
                returnValues.push(returnNode);
                continue;
            }

            const parsedExpression = parser(commandOrigin, expression);

            returnNode.value = parsedExpression;

            returnValues.push(returnNode);
        }

        return returnValues;
    }

    private static getExpressionType(expression: string): SyntaxNodeType {
        if (expression.startsWith("@")) {
            return SyntaxNodeTypeEnum.Selector;
        } else if (!isNaN(Number(expression))) {
            return SyntaxNodeTypeEnum.Number;
        } else if (this.stringLiterals.has(expression)) {
            return expression;
        } else {
            return SyntaxNodeTypeEnum.String;
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
