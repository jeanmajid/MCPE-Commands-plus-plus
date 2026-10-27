import { SyntaxNodeType } from "../types.js";

type NodeParserFunction = () => unknown;

export class NodeType {
    private static parseTree: Record<string, NodeParserFunction> = {};

    public static register(_type: SyntaxNodeType, _action: NodeParserFunction): void {}
}
