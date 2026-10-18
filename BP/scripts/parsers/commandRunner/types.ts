export enum SyntaxNodeType {
    Root,
    String,
    Selector,
    Literal,
}

export interface BracketPair {
    start: number;
    end: number;
}
