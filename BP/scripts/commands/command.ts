import { CustomCommand, CustomCommandOrigin, CustomCommandResult, system } from "@minecraft/server";
import { NAMESPACE } from "../constants/namespace";

type CustomCommandCallback = (
    origin: CustomCommandOrigin,
    ...args: any[]
) => CustomCommandResult | undefined;

type Command = {
    data: CustomCommand;
    callback: CustomCommandCallback;
};

type CommandEnum = {
    name: string;
    values: string[];
};

export class CommandManager {
    static commands: Command[] = [];
    static enums: CommandEnum[] = [];

    static registerCommand(
        customCommand: CustomCommand,
        commandCallback: CustomCommandCallback
    ): void {
        CommandManager.commands.push({ data: customCommand, callback: commandCallback });
    }

    static registerEnum(name: string, values: string[]): void {
        this.enums.push({ name, values });
    }
}

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    for (const commandEnum of CommandManager.enums) {
        if (!commandEnum.name.startsWith(NAMESPACE)) {
            commandEnum.name = NAMESPACE + commandEnum.name;
        }
        customCommandRegistry.registerEnum(commandEnum.name, commandEnum.values);
    }

    for (const command of CommandManager.commands) {
        if (!command.data.name.startsWith(NAMESPACE)) {
            command.data.name = NAMESPACE + command.data.name;
        }
        customCommandRegistry.registerCommand(command.data, command.callback);
    }
});
