import { SyntaxNodeType } from "./types.js";

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
