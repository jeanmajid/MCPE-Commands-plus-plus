/**@import { CallbackParams, callback, chatCommand } from "./chatCommand.d.ts" */
import { levenshteinDistance } from "../utils/levenshteinDistance";

export class ChatCommand {
    /**@type {Object<string, chatCommand>} */
    static commands = {};

    /**
     * @description Register a new command
     * @param {chatCommand} info
     * @param {callback} callback
     */
    static register(info, callback) {
        if (!info.name) throw new Error(`Failed to import a command, no name specified`);
        if (this.getCommand(info.name)) throw new Error(`Failed to import ${info.name} already exists`);
        this.commands[info.name.toLowerCase()] = {
            name: info.name.toLowerCase(),
            aliases: info.aliases ? info.aliases.map((alias) => alias.toLowerCase()) : [],
            description: info.description,
            callback: callback,
        };
    }

    /**
     * @description Get the closest command to the given name
     * @param {String} name
     * @returns {chatCommand}
     */
    static getClosestCommand(name) {
        name = name.toLowerCase();
        let commands = Object.keys(this.commands).filter((cmd) => cmd.includes(name));
        if (commands.length === 0) commands = Object.keys(this.commands);
        let closestCommand = null;
        let minDistance = Infinity;
        for (const command of commands) {
            const distance = levenshteinDistance(command, name);
            if (distance < minDistance) {
                minDistance = distance;
                closestCommand = this.commands[command];
            }
        }
        return closestCommand;
    }

    /**
     * @description Get a command by name or alias
     * @param {String} name
     * @returns {chatCommand | undefined}
     */
    static getCommand(name) {
        if (!name) return undefined;
        return this.commands[name.toLowerCase()] || this.commands[Object.keys(this.commands).find((cmd) => this.commands[cmd].aliases.includes(name.toLowerCase()))];
    }
}
