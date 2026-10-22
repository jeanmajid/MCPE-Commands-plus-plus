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

import { system } from "@minecraft/server";

import { NAMESPACE } from "../constants/namespace.js";

interface CommandEnum {
    name: string;
    values: string[];
}

export class EnumManager {
    public static enums: CommandEnum[] = [];

    public static register(name: string, values: string[]): void {
        this.enums.push({ name, values });
    }
}

const event = system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    for (const commandEnum of EnumManager.enums) {
        if (!commandEnum.name.startsWith(NAMESPACE)) {
            commandEnum.name = NAMESPACE + commandEnum.name;
        }

        try {
            customCommandRegistry.registerEnum(commandEnum.name, commandEnum.values);
        } catch (err) {
            console.error(`Failed to register enum ${commandEnum.name}\nError: ${err}`);
        }
    }

    system.beforeEvents.startup.unsubscribe(event);
});
