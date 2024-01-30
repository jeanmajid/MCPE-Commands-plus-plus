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
            const args = codeLines[i].split(/ /);

            for (let i = 0; i < args.length; i++) {
                if (args[i].startsWith("@")) {
                    if (args[i] === "@a" || args[i] === "@e" || args[i] === "@p" || args[i] === "@r" || args[i] === "@s" || args[i] === "@cancel") continue;
                    const method = args[i].slice(1).match(/^[^.]+/)[0];
                    if (!module.methods.includes(method)) world.sendMessage(`§c[§e${module.name}§c] §r§7Method §e${method}§7 is not allowed!`);
                    // const dotargs = args[i].slice(1).split(".").slice(1);
                    // for (let j = 0; j < dotargs.length; j++) {
                    //     const dotarg = dotargs[j].toLowerCase();
                    //     switch (dotarg) {
                    //         case "vd":
                    //         case "viewdirection":
                    //             if (!dotargs[j + 1]) {
                    //                 args[i] = `data.${source}.getViewDirection();`;
                    //             } else {
                    //                 switch (dotargs[j + 1].toLowerCase()) {
                    //                     case "x":
                    //                         args[i] = `data.${source}.getViewDirection().x`;
                    //                         break;
                    //                     case "y":
                    //                         args[i] = `data.${source}.getViewDirection().y`;
                    //                         break;
                    //                     case "z":
                    //                         args[i] = `data.${source}.getViewDirection().z`;
                    //                         break;
                    //                 }
                    //             }
                    //             stopConvertFirstLine = true;
                    //             break;
                    //     }
                    // }
                    args[i] = args[i].replace(/@/g, "data.");
                }
            }

            switch (args[0]) {
                case "@cancel":
                    addCode("data.cancel = true;");
                    break;
                case "if":
                    addCode(
                        `if (${args[1].startsWith("data.") ? args[1] : `"${args[1]}"`} == ${args
                            .splice(2)
                            .map((arg) => (arg.startsWith("data.") ? arg : `"${arg}"`))
                            .join(" ")}) {`
                    );
                    break;
                case "endif":
                    addCode("}");
                    break;
                default:
                    if (args[0].startsWith("data.")) {
                        addCode(`${args[0]}(${args.slice(1).join(", ")});`);
                        continue;
                    }
                    addCode(`${source}.runCommandAsync("${codeLines[i].replace(/\$/g, "@").replace(/"/g, '\\"')}");`);
                    break;
            }
        }
        let functionBodyLines = functionBody.split("\n");
        for (let i = 0; i < functionBodyLines.length; i++) {
            try {
                eval(functionBodyLines[i]);
            } catch (error) {
                if (error.message.includes("does not have required privileges.")) {
                    functionBodyLines[i] = functionBodyLines[i] = `system.run(() => {${functionBodyLines[i]}})`;
                }
            }
        }
        // console.warn(functionBodyLines.join("\n"));
        module.compiledCode = new Function("data", functionBodyLines.join("\n"));
        module.compiledCode(data);
        system.run(() => {
            module.event.unsubscribe(module.eventId);
            module.eventId = module.event.subscribe(module.compiledCode);
        });
    }
}

