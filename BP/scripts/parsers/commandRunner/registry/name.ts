import { CommandRunner } from "../commandRunner.js";
import { Node } from "../node.js";
import { NodePath } from "../nodePath.js";
import { SyntaxNodeType } from "../types.js";

const nameSyntaxSelector = new Node(SyntaxNodeType.Selector);
const nameSyntaxString = new Node(SyntaxNodeType.String);
nameSyntaxSelector.addChild(nameSyntaxString);

// @s.string -> path
// @s.string.string -> path

const path1 = new NodePath();
path1.addNode(nameSyntaxSelector);
path1.addNode(nameSyntaxString);
path1.addAction(() => {
    console.log("bombo");
});

CommandRunner.registerSyntax(path1);

// (selector: Entity[], string: string) => {
//     asdasdasd
// }

// (selector: Entity[], string: string, string2: string) => {
//     asdasdasd
// }
