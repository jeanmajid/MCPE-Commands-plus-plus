import { system, world } from "@minecraft/server";
globalThis.world = world; // pretty stupid that I gotta do this did not find another solution
globalThis.system = system;

export function handleEvent(data, module) {
    if (!module.state) return;
    if (!module.compiledCode) {
        const addCode = (code) => (functionBody += code + "\n");
        const codeLines = module.code;
        let functionBody = "";
        for (let i = 0; i < codeLines.length; i++) {
            let source = module.source;
            if (source === "world") source = 'world.getDimension("overworld")';
            else source = `data.${source}`;
            const command = codeLines[i].split(/ /)[0].toLowerCase();
            const args = codeLines[i].slice(1).split(/ /).slice(1);
            for (let i = 0; i < args.length; i++) {
                if (args[i].startsWith("@")) {
                    if (args[i] === "@a" || args[i] === "@e" || args[i] === "@p" || args[i] === "@r" || args[i] === "@s") continue;
                    const method = args[i].slice(1).match(/^[^.]+/)[0];
                    if (!module.methods.includes(method)) world.sendMessage(`§c[§e${module.name}§c] §r§7Method §e${method}§7 is not allowed!`);
                    args[i] = args[i].replace(/@/g, "data.");
                }
            }
            if (command.startsWith("@") && command !== "@cancel") {
                addCode(`system.run(() => {data.${command.slice(1)}(${args.join(" ")});})`);
                continue;
            }

            switch (command) {
                case "@cancel":
                    addCode("data.cancel = true;");
                    break;
                case "if":
                    if (args.includes("run")) {
                        addCode(`if ("${args[0]}" == "${args[1]}") {`);
                        break;
                    }
                    addCode(`if (${args[0]} == ${args.splice(1).join(" ")}) {`);
                    break;
                case "endif":
                    addCode("}");
                    break;
                default:
                    addCode(`${source}.runCommandAsync("${codeLines[i].replace(/\$/g, "@").replace(/"/g, '\\"')}");`);
                    break;
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
