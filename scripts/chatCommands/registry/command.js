import { CustomCommand } from "../../customCommands/handler";
import { ChatCommand } from "../../models/chatCommand";

ChatCommand.register(
    {
        name: "command",
        description: "Run a custom command",
    },
    ({ source, args }) => {
        const customCommand = CustomCommand.getCommand(args[0]);
        if (command.notFound) return source.sendMessage(customCommand.errormsg);
        system.run(() => {
            try {
                customCommand.callback({ args: args.slice(1).map((arg) => parseInt(arg)), source: source });
            } catch (error) {
                source.sendMessage(`ERROR: ${error}`);
            }
        });
    }
);
