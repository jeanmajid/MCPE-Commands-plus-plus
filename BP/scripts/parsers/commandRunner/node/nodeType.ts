import { SyntaxNodeType } from "../types.js";

type NodeParserFunction = (expression: string) => unknown;

export class NodeType {
    private static parseTree: Record<string, NodeParserFunction> = {};

    public static register(type: SyntaxNodeType, action: NodeParserFunction): void {
        this.parseTree[type] = action;
    }

    public static getParser(type: SyntaxNodeType): NodeParserFunction {
        return this.parseTree[type];
    }
}
