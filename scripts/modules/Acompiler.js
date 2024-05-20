import { system, world } from "@minecraft/server";
globalThis.world = world;
globalThis.system = system;

const allowedOperators = new Set(["==", "!=", "<", ">", "<=", ">="]);

const argActions = new Map([
    ["@cancel", ({ module }) => world.sendMessage(`§c[§e${module.name}§c] §c@cancel is not allowed in After events.`)],
    [
        "if",
        ({ args, argMetaData, addCode }) => {
            let ifLine = "";
            ifLine += "if (";
            if (argMetaData[1].processed || args[1].startsWith("data.")) {
                ifLine += args[1];
            } else {
                ifLine += `"${args[1]}"`;
            }

            if (allowedOperators.has(args[2])) {
                ifLine += ` ${args[2]} `;
            } else {
                world.sendMessage(`§c[§e${module.name}§c] §r§7Operator §e${args[2]}§7 is not allowed!`);
            }

            if (argMetaData[3].processed || args[3].startsWith("data.")) {
                ifLine += args[3];
            } else {
                ifLine += `"${args[3]}"`;
            }

            ifLine += ") {";
            addCode(ifLine);
        },
    ],
    ["endif", ({ addCode }) => addCode("}")],
]);

const actorActions = new Map([["score", (source, args) => `world.scoreboard.getObjective("${args[0]}").getScore(data.${source})`]]);

export function compileCode(data, module) {
    if (!module.state) return;
    if (!module.compiledCode) {
        let functionBody = "";
        const addCode = (code) => (functionBody += code + "\n");
        const codeLines = module.code;
        let source = module.source;
        if (source === "world") source = 'world.getDimension("overworld")';
        else source = `data.${source}`;

        for (let i = 0; i < codeLines.length; i++) {
            const args = codeLines[i].split(/ /);
            const argMetaData = Array.from({ length: args.length }, () => ({}));

            for (let j = 0; j < args.length; j++) {
                if (args[j].startsWith("@")) {
                    const parts = args[j].slice(1).split(".");
                    const method = parts[0];
                    if (!module.methods.includes(method)) world.sendMessage(`§c[§e${module.name}§c] §r§7Method §e${method}§7 is not allowed!`);
                    if (parts.length > 2 && actorActions.has(parts[1])) {
                        const actorAction = actorActions.get(parts[1]);
                        if (actorAction) {
                            const newArgs = parts.slice(2);
                            args[j] = actorAction(parts[0], newArgs);
                            argMetaData[j].processed = true;
                        }
                    } else {
                        args[j] = args[j].replace(/@/g, "data.");
                    }
                }
            }

            const action = argActions.get(args[0]);
            if (action) {
                action({ module, args, argMetaData, addCode });
            } else {
                if (args[0].startsWith("data.")) {
                    addCode(`${args[0]}(${args.slice(1).join(", ")});`);
                    continue;
                }
                if (argMetaData.some((meta) => meta.processed)) {
                    let processedArgs = [];
                    for (let i = 0; i < args.length; i++) {
                        if (argMetaData[i]?.processed) {
                            processedArgs.push(`\${${args[i]}}`);
                        } else {
                            processedArgs.push(args[i]);
                        }
                    }
                    addCode(`${source}.runCommandAsync(\`${processedArgs.join(" ")}\`);`);
                } else {
                    addCode(`${source}.runCommandAsync("${args.join(" ").replace(/\$/g, "@").replace(/"/g, '\\"')}");`);
                }
            }
        }
        module.compiledCode = new Function("data", functionBody);
        module.compiledCode(data);
        system.run(() => {
            module.event.unsubscribe(module.eventId);
            module.eventId = module.event.subscribe(module.compiledCode);
        });
    }
}
