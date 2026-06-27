/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import { CustomCommand, CustomCommandOrigin, CustomCommandResult, system } from "@minecraft/server";

import { NAMESPACE } from "../constants/namespace";

type CustomCommandCallback = (
    origin: CustomCommandOrigin,
    // oxlint-disable-next-line typescript/no-explicit-any Commands are bound to specific types anyways, so any is fine
    ...args: any[]
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
