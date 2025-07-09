import { CustomCommand, CustomCommandOrigin, CustomCommandResult, system } from "@minecraft/server";
import { NAMESPACE } from "../constants/namespace";

type CustomCommandCallback = (
    origin: CustomCommandOrigin,
    ...args: unknown[]
) => CustomCommandResult | undefined;

type Command = {
    data: CustomCommand;
    callback: CustomCommandCallback;
};

export class CommandManager {
    static commands: Command[] = [];

    static registerCommand(
        customCommand: CustomCommand,
        commandCallback: CustomCommandCallback
    ): void {
        CommandManager.commands.push({ data: customCommand, callback: commandCallback });
    }
}

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    for (const command of CommandManager.commands) {
        if (!command.data.name.startsWith(NAMESPACE)) {
            command.data.name = NAMESPACE + command.data.name;
        }
        customCommandRegistry.registerCommand(command.data, command.callback);
    }
});
