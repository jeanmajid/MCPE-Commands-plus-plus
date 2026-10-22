/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 */

import {
    CustomCommand,
    CustomCommandOrigin,
    CustomCommandParameter,
    CustomCommandParamType,
    CustomCommandResult,
    system,
} from "@minecraft/server";

import { NAMESPACE } from "../constants/namespace.js";

type CustomCommandCallback = (
    origin: CustomCommandOrigin,
    // oxlint-disable-next-line typescript/no-explicit-any Commands are bound to specific types anyways, so any is fine
    ...args: any[]
) => CustomCommandResult | undefined;

type CommandData = { aliases?: string[] } & CustomCommand;

interface Command {
    data: CommandData;
    callback: CustomCommandCallback;
}

interface CommandEnum {
    name: string;
    values: string[];
}

export class CommandManager {
    public static commands: Command[] = [];
    public static enums: CommandEnum[] = [];

    public static register(
        customCommand: CommandData,
        commandCallback: CustomCommandCallback
    ): void {
        CommandManager.commands.push({ data: customCommand, callback: commandCallback });
    }
}

const event = system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    for (const command of CommandManager.commands) {
        if (!command.data.name.startsWith(NAMESPACE)) {
            command.data.name = NAMESPACE + command.data.name;
        }

        if (command.data.mandatoryParameters) {
            processParams(command.data.mandatoryParameters);
        }

        if (command.data.optionalParameters) {
            processParams(command.data.optionalParameters);
        }

        try {
            customCommandRegistry.registerCommand(command.data, command.callback);
        } catch (err) {
            console.error(`Failed to register command ${command.data.name}\nError: ${err}`);
        }

        if (command.data.aliases) {
            const originalName = command.data.name;

            for (let alias of command.data.aliases) {
                if (!alias.startsWith(NAMESPACE)) {
                    alias = NAMESPACE + alias;
                }

                command.data.name = alias;

                try {
                    customCommandRegistry.registerCommand(command.data, command.callback);
                } catch (err) {
                    console.error(`Failed to register alias ${command.data.name}\nError: ${err}`);
                }
            }

            command.data.name = originalName;
        }
    }

    system.beforeEvents.startup.unsubscribe(event);
});

function processParams(params: CustomCommandParameter[]): void {
    for (const param of params) {
        if (
            param.type === CustomCommandParamType.Enum &&
            param.enumName &&
            !param.enumName.startsWith(NAMESPACE)
        ) {
            param.enumName = NAMESPACE + param.enumName;
        }
    }
}
