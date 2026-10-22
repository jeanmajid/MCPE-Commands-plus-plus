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
    CallExpression,
    ExpressionStatement,
    parse,
    Program,
    Expression,
    ObjectExpression,
    PropertyKey,
} from "yuku-parser";

import { ENUM_CONVERSION } from "../constants/conversion.js";

type ClassMethodCall = ExpressionStatement & { expression: CallExpression };

export class TSParser {
    private program: Program;

    public constructor(fileContents: string) {
        const { program } = parse(fileContents, { lang: "ts" });

        this.program = program;
    }

    public findClassMethodCall(className: string, methodName: string): ClassMethodCall | undefined {
        for (const token of this.program.body) {
            if (
                token.type !== "ExpressionStatement" ||
                token.expression.type !== "CallExpression"
            ) {
                continue;
            }

            const { callee } = token.expression;
            if (
                callee.type !== "MemberExpression" ||
                callee.object.type !== "Identifier" ||
                callee.property.type !== "Identifier"
            ) {
                continue;
            }

            const foundClassName = callee.object.name;
            const foundMethodName = callee.property.name;

            if (foundClassName !== className || foundMethodName !== methodName) {
                continue;
            }

            return token as ClassMethodCall;
        }
    }

    public getKey(key: PropertyKey): string {
        if (key.type !== "Identifier") {
            throw new Error("unexpected key type, we only support strings");
        }

        return key.name;
    }

    // oxlint-disable-next-line typescript/no-explicit-any
    public getValue(value: Expression): any {
        switch (value.type) {
            case "Literal": {
                return value.value as string;
            }
            case "MemberExpression": {
                if (value.object.type !== "Identifier" || value.property.type !== "Identifier") {
                    throw new Error("unexpected member expression");
                }

                const name = ENUM_CONVERSION[value.object.name]?.[value.property.name];
                if (!name) {
                    throw new Error(
                        `unhandled enum conversion: ${value.object.name}.${value.property.name}`
                    );
                }

                return name;
            }
            case "ArrayExpression": {
                // idk if this is actually type safe, but time will tell
                return value.elements.map((v) => this.getValue(v as Expression));
            }
            case "ObjectExpression": {
                return this.readObjectExpression(value);
            }
            case "Identifier": {
                return value.name;
            }
            default:
                console.debug(value);
                throw new Error("Unhandled value type: " + value.type);
        }
    }

    public readObjectExpression(objectExpression: ObjectExpression): object {
        // oxlint-disable-next-line typescript/no-explicit-any
        const returnObject: Record<string, any> = {};

        for (const propertyToken of objectExpression.properties) {
            if (propertyToken.type !== "Property") {
                throw new Error("unexpected property type, please implement SpreadElement");
            }

            const key = this.getKey(propertyToken.key);
            const value = this.getValue(propertyToken.value);

            returnObject[key] = value;
        }

        return returnObject;
    }
}
