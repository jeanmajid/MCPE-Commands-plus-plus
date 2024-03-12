export class CustomCommand {
    static commands = [];

    static register({ name, description }, callback) {
        this.commands.push({
            name,
            description,
            callback,
        });
    }

    static get commands() {
        return this.commands;
    }

    static getModule(name) {
        if (!name) return undefined;
        name = name.toLowerCase();
        return this.commands.find((c) => c.name.toLowerCase() === name);
    }
}
