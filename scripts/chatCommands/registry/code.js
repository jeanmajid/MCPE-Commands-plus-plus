import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";

ChatCommand.register(
    {
        name: "code",
        description: "Manage the code of an module",
    },
    ({ source, args }) => {
        let lineIndex;
        const module = Module.getModuleWithMessage(args[0]);
        if (module.error) return source.sendMessage(module.message);
        if (!module.event) return source.sendMessage(`§cModule ${module.name} is not of type event`);
        switch (args[1]) {
            case "add":
                lineIndex = parseInt(args[2]) - 1;
                if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) {
                    module.code.push(args.slice(2).join(" "));
                } else {
                    module.code.splice(lineIndex + 1, 0, args.slice(3).join(" "));
                }
                Module.updateCode(module);
                source.sendMessage(`§aAdded code to ${module.name}`);
                showCode(source, module);
                break;
            case "remove":
                lineIndex = parseInt(args[2]) - 1;
                if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) return source.sendMessage(`§cInvalid line number`);
                module.code.splice(lineIndex, 1);
                Module.updateCode(module);
                source.sendMessage(`§aRemoved line ${lineIndex + 1} of code from ${module.name}`);
                showCode(source, module);
                break;
            case "set":
                lineIndex = parseInt(args[2]) - 1;
                if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) return source.sendMessage(`§cInvalid line number`);
                module.code[lineIndex] = args.slice(3).join(" ");
                Module.updateCode(module);
                source.sendMessage(`§aSet line ${lineIndex + 1} of code of ${module.name} to ${module.code[lineIndex]}`);
                showCode(source, module);
                break;
            case "setall":
                const code = args.slice(2).join(" ").split(/;/);
                if (code[0].length < 1) return source.sendMessage(`§cNo code provided`);
                module.code = code;
                Module.updateCode(module);
                source.sendMessage(`§aSet code of ${module.name} to ${module.code}`);
                showCode(source, module);
                break;
            case "show":
                if (args[2] === "compiled") {
                    if (!module.compiledCode) return source.sendMessage(`§cCode of ${module.name} is not compiled yet`);
                    const codeLines = module.compiledCode.toString().split("\n");
                    const formattedCodeLines = codeLines.map((line, index) => `§7${index + 1} §b${line}`);
                    source.sendMessage(`§dCompiled code of ${module.name}`);
                    formattedCodeLines.forEach((line) => {
                        source.sendMessage(`§b${colorizeCode(line)}`);
                    });
                    break;
                }
                if (module.code.length < 1) return source.sendMessage(`§cNo Code available for this module`);
                showCode(source, module);
                break;
            default:
                source.sendMessage(`§cSpecify a subcommand (add, remove, set, setall, show)`);
                break;
        }
    }
);

function colorizeCode(code) {
    // @text
    code = code.replace(/(@\w+)/g, "§a$1§b");
    // if
    code = code.replace(/\b(if)\b/g, "§6$1§b");
    //endif
    code = code.replace(/\b(endif)\b/g, "§6$1§b");

    code = `§b${code}`;

    return code;
}

function showCode(source, module) {
    source.sendMessage(`§dCode of ${module.name}:`);
    module.code.forEach((line, index) => {
        source.sendMessage(`§7${index + 1} §b${colorizeCode(line)}`);
    });
}
