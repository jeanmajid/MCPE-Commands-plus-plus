export class CustomCommand {
    static commands = [];
    /**
     * @param {{name: string, description: string}} param0
     * @param {(data: { source: import("@minecraft/server").Player | import("@minecraft/server").Entity; args: string[] }) => void} callback
     */
    static register({ name, description }, callback) {
        this.commands.push({
            name,
            description,
            callback,
        });
    }

    static getCommand(name) {
        if (!name) return { notFound: true, errormsg: "§cNo command name provided." };
        name = name.toLowerCase();
        const command = this.commands.find((c) => c.name.toLowerCase() === name);
        if (!command) return { notFound: true, errormsg: "§cCommand not found." };
        return command;
    }
}
