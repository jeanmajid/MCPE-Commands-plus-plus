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
