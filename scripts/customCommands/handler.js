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

    static getCommand(name) {
        if (!name) return {notFound: true, errormsg: "§cNo command name provided."};
        name = name.toLowerCase();
        const command = this.commands.find((c) => c.name.toLowerCase() === name);
        if (!command) return {notFound: true, errormsg: "§cCommand not found."};
        return command;
    }
}
