import { CustomCommand, CustomCommandOrigin, CustomCommandResult, system } from "@minecraft/server";

import { NAMESPACE } from "../constants/namespace";

type CustomCommandCallback = (
    origin: CustomCommandOrigin,
    ...args: unknown[]
) => CustomCommandResult | undefined;

interface Command {
    data: CustomCommand;
    callback: CustomCommandCallback;
}

interface CommandEnum {
    name: string;
    values: string[];
}

export class CommandManager {
    public static commands: Command[] = [];
    public static enums: CommandEnum[] = [];

    public static registerCommand(
        customCommand: CustomCommand,
        commandCallback: CustomCommandCallback
    ): void {
        CommandManager.commands.push({ data: customCommand, callback: commandCallback });
    }

    public static registerEnum(name: string, values: string[]): void {
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
