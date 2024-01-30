import { world, system } from "@minecraft/server";
import { levenshteinDistance } from "./utils";

export class Module {
    static scoreModules = [];
    static eventModules = [];

    static register(info, callback) {
        if (!info.name) throw new Error(`Failed to import a module, no name specified`);
        if (this.getAllModules().find((m) => m.name === info.name)) throw new Error(`Failed to import ${info.name} already exists`);
        if (info.scoreboard) {
            const data = JSON.parse(world.getDynamicProperty(info.name) || "{}");

            this.scoreModules.push({
                name: info.name,
                description: info.description || "",
                scoreboard: info.scoreboard,
                interval: info.interval || 20,
                state: data.state ?? info.state ?? false,
                callback: data.callback || callback,
            });

            if (world.getDynamicProperty(info.name) === undefined) {
                this.updateModule(info);
            }
        } else if (info.event) {
            const data = JSON.parse(world.getDynamicProperty(info.name) || "{}");

            this.eventModules.push({
                name: info.name,
                description: info.description || "",
                event: info.event,
                state: data.state ?? info.state ?? false,
                type: info.type,
                source: data.source || info.source || "undefined",
                methods: info.methods || [],
                types: info.types || [],
                code: data.code || info.code,
                callback: callback,
            });

            if (world.getDynamicProperty(info.name) === undefined) {
                this.updateModule(info);
            }
        } else {
            throw new Error(`Failed to import ${info.name} please fix :)
            Error: you forgot to specify the type of the module either use event or scoreboard`);
        }
    }

    static getAllModules() {
        return [...this.eventModules, ...this.scoreModules];
    }

    static getModule(name) {
        if (!name) return undefined;
        name = name.toLowerCase();
        return this.getAllModules().find((m) => m.name.toLowerCase() === name);
    }

    static toggleModule(name, state) {
        if (name === "all") {
            this.getAllModules().forEach((m) => {
                if (m.state !== state) {
                    m.state = state;
                    module.compiledCode = undefined;
                    this.updateModule(m);
                }
            });
            return `§aAll modules ${state ? "enabled" : "disabled"} successfully`;
        }
        const module = this.getModule(name);
        if (!module) return `§cModule ${name} not found. Did you mean ${this.getClosestModule(name).name}?`;
        if (module.state === state) return `§cModule ${module.name} is already ${state ? "enabled" : "disabled"}`;
        module.state = state;
        module.compiledCode = undefined;
        this.updateModule(module);
        return `§aModule ${module.name} ${state ? "enabled" : "disabled"} successfully`;
    }

    static updateModule(module) {
        world.setDynamicProperty(
            module.name,
            JSON.stringify({
                state: module.state,
                interval: module.interval || undefined,
                scoreboard: module.scoreboard || undefined,
                source: module.source || undefined,
                code: module.code || undefined,
            })
        );
    }

    static updateCode(module) {
        if (!module.state) return;
        module.compiledCode = undefined;
        system.run(() => {
            module.event.unsubscribe(module.eventId);
            module.eventId = module.event.subscribe(module.callback);
        });
        this.updateModule(module);
    }

    static getClosestModule(name) {
        name = name.toLowerCase();
        let modules = this.getAllModules().filter((m) => m.name.toLowerCase().includes(name));
        if (modules.length === 0) modules = this.getAllModules();
        let closestModule = null;
        let minDistance = Infinity;
        for (const module of modules) {
            const distance = levenshteinDistance(module.name.toLowerCase(), name);
            if (distance < minDistance) {
                minDistance = distance;
                closestModule = module;
            }
        }
        return closestModule;
    }

    static getAmountOfBytesUsed(module) {
        if (module instanceof String) {
            return { variable: encodeURIComponent(module).replace(/%..|./g, "_").length, property: 0 };
        }
        return { variable: encodeURIComponent(JSON.stringify(module)).replace(/%..|./g, "_").length, property: encodeURIComponent(world.getDynamicProperty(module.name)).replace(/%..|./g, "_").length };
    }

    static getTotalAmountOfBytesUsed() {
        let totalVar = 0;
        let totalProp = 0;
        for (const module of this.getAllModules()) {
            const { variable, property } = this.getAmountOfBytesUsed(module);
            totalVar += variable;
            totalProp += property;
        }
        return { variable: totalVar, property: totalProp };
    }
}
