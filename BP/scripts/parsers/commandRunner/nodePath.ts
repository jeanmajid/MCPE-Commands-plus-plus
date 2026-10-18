import { Node } from "./node.js";

export class NodePath {
    public path: number[] = [];
    public action: (() => void) | null = null;

    public addNode(node: Node): void {
        this.path.push(node.type);
    }

    public addAction(action: () => void): void {
        this.action = action;
    }
}
