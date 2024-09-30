import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";
import { register } from "../../register";

ChatCommand.register(
    {
        name: "enable",
        description: "Enable a module",
    },
    ({ source, args }) => {
        if (!args[0]) return source.sendMessage("§cInvalid argument: Please input a module name");
        source.sendMessage(Module.toggleModule(args[0], true));
        system.run(() => {
            register();
        });
    }
);
