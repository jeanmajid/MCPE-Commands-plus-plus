import { CallExpression, ExpressionStatement, parse, Program } from "@yuku-parser/wasm";

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
}
