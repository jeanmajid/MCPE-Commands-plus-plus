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

import { EntityHealthChangedAfterEvent, world } from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute";

class HealthAttribute extends BaseAttribute {
    public id = "health";
    public event?: (arg0: EntityHealthChangedAfterEvent) => void;

    public initialize(): void {
        // TODO: get all entities and set their health score
        this.event = world.afterEvents.entityHealthChanged.subscribe(({ entity, newValue }) => {
            this.score.setScore(entity, newValue);
        });
    }

    public cleanup(): void {
        // oxlint-disable-next-line typescript/no-non-null-assertion
        world.afterEvents.entityHealthChanged.unsubscribe(this.event!);
    }
}

AttributeManager.registerAttribute(new HealthAttribute());
