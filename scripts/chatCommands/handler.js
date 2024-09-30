import { world, system } from "@minecraft/server";
import { ChatCommand } from "../models/chatCommand";

world.beforeEvents.chatSend.subscribe((data) => {
    if (!data.sender.isOp()) return;
    if (!data.message.startsWith("!")) return;
    data.cancel = true;
    const command = data.message.split(/ /)[0].slice(1).toLowerCase();
    const args = data.message.split(/ /).slice(1);

    const commandObject = ChatCommand.getCommand(command);
    if (!commandObject) {
        const closestCommand = ChatCommand.getClosestCommand(command);
        if (!closestCommand) return data.sender.sendMessage(`§cCommand not found.`);
        return data.sender.sendMessage(`§cUnknown command ${command}. Did you mean ${closestCommand.name} ?`);
    }
    commandObject.callback({ source: data.sender, args });
});

system.afterEvents.scriptEventReceive.subscribe((data) => {
    if (!data.id.startsWith("jmc:")) return;
    const command = data.id.slice(4).toLowerCase();
    const args = data.message.split(/ /);

    const commandObject = ChatCommand.getCommand(command);
    if (!commandObject) {
        const closestCommand = ChatCommand.getClosestCommand(command);
        if (!closestCommand) return data.source.sendMessage(`§cCommand not found.`);
        return data.source.sendMessage(`§cUnknown command ${command}. Did you mean ${closestCommand.name} ?`);
    }
    const source = data.initiator ?? data.sourceBlock ?? data.sourceEntity;
    source.sendMessage ??= (_) => {};
    commandObject.callback({ source, args });
});
