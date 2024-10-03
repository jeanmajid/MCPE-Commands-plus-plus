/**@import { callback, eventModule, scoreModule } from "./moduleTypes.d.ts" */

import { world, system } from "@minecraft/server";
import { levenshteinDistance } from "../utils/levenshteinDistance";

export class Module {
    /**@type {scoreModule[]} */
    static scoreModules = [];
    /**@type {eventModule[]} */
    static eventModules = [];

    /**
     * @description Register a new module
     * @param {scoreModule | eventModule} info
     * @param {callback} callback
     */
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
            throw new Error(`Failed to import ${info.name} please fix :)`);
        }
    }

    /**
     * @description Get all modules
     * @returns {scoreModule[] | eventModule[]}
     */
    static getAllModules() {
        return [...this.eventModules, ...this.scoreModules];
    }

    /**
     * @description Get a module based on its name
     * @param {String} name
     * @returns {scoreModule | eventModule | undefined}
     */
    static getModule(name) {
        if (!name) return undefined;
        name = name.toLowerCase();
        return this.getAllModules().find((m) => m.name.toLowerCase() === name);
    }

    /**
     * @description Get a module based on its name with some additional error handling
     * @param {String} name
     * @returns {scoreModule | eventModule | undefined}
     * @example
     * module = Module.getModuleWithMessage(args[0]);
     * if (module.error) return source.sendMessage(module.message);
     * if (!module.event) return source.sendMessage(`§cModule ${module.name} is not of type event`);
     */
    static getModuleWithMessage(name) {
        let module = Module.getModule(name);
        if (!name || name.length < 1) return { error: true, message: "§cSpecify a module" };
        if (!module) return { error: true, message: `§cNo module named ${name} found, did you mean ${Module.getClosestModule(name).name}?` };
        return module;
    }

    /**
     * @description Toggle a module on or off based on its state
     * @param {String} name
     * @returns {scoreModule | eventModule | undefined}
     */
    static toggleModule(name, state) {
        // TODO toggle all is broken for some reason will fix later isn't really that important
        // if (name === "all") {
        //     this.getAllModules().forEach((m) => {
        //         if (m.state !== state) {
        //             m.state = state;
        //             module.compiledCode = undefined;
        //             this.updateModule(m);
        //         }
        //     });
        //     return `§aAll modules ${state ? "enabled" : "disabled"} successfully`;
        // }
        const module = this.getModuleWithMessage(name);
        if (module.error) return module.message;
        if (module.state === state) return `§cModule ${module.name} is already ${state ? "enabled" : "disabled"}`;
        module.state = state;
        module.compiledCode = undefined;
        this.updateModule(module);
        return `§aModule ${module.name} ${state ? "enabled" : "disabled"} successfully`;
    }

    /**
     * @description Updates a module in the world properties
     * @param {eventModule | scoreModule} module
     */
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

    /**
     * @description Updates the code of a module
     * @param {eventModule} module
     */
    static updateCode(module) {
        if (!module.state) return;
        module.compiledCode = undefined;
        system.run(() => {
            module.event.unsubscribe(module.eventId);
            module.eventId = module.event.subscribe(module.callback);
        });
        this.updateModule(module);
    }

    /**
     * @description Get the closest module based on the name
     * @param {String} name
     * @returns {scoreModule | eventModule | undefined}
     */
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

    /**
     * @description Get the amount of bytes used by a module
     * @param {eventModule | scoreModule} module
     * @returns {{ variable: number, property: number }}
     */
    static getAmountOfBytesUsed(module) {
        if (module instanceof String) {
            return { variable: encodeURIComponent(module).replace(/%..|./g, "_").length, property: 0 };
        }
        return {
            variable: encodeURIComponent(JSON.stringify(module)).replace(/%..|./g, "_").length,
            property: encodeURIComponent(world.getDynamicProperty(module.name)).replace(/%..|./g, "_").length,
        };
    }

    /**
     * @description Get the total amount of bytes used by all modules
     * @returns {{ variable: number, property: number }}
     */
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
