import { SyntaxNodeType } from "../types.js";

type NodeParserFunction = () => unknown;

export class NodeType {
    static parseTree: Record<string, NodeParserFunction> = {};

    static register(type: SyntaxNodeType, action: NodeParserFunction): void {}
}
