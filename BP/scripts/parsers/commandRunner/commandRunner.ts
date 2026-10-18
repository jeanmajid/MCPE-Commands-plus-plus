import { Node } from "./node.js";
import { NodePath } from "./nodePath.js";
import { BracketPair, SyntaxNodeType } from "./types.js";

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
    }

    private static parseBrackets(command: string, bracketPairs: BracketPair[]): void {
        for (let i = bracketPairs.length - 1; i >= 0; --i) {
            const pair = bracketPairs[i];

            const bracketContents = command.slice(pair.start + 1, pair.end);

            console.log(bracketContents);
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
