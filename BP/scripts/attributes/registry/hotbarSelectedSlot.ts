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

import { PlayerHotbarSelectedSlotChangeAfterEvent, world } from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute";

class HotbarSelectedSlotAttribute extends BaseAttribute {
    public id = "selectedHotbarSlot";
    public event?: (arg0: PlayerHotbarSelectedSlotChangeAfterEvent) => void;

    public initialize(): void {
        this.event = world.afterEvents.playerHotbarSelectedSlotChange.subscribe(
            ({ player, newSlotSelected }) => {
                this.score.setScore(player, newSlotSelected);
            }
        );
    }

    public cleanup(): void {
        // oxlint-disable-next-line typescript/no-non-null-assertion
        world.afterEvents.playerHotbarSelectedSlotChange.unsubscribe(this.event!);
    }
}

AttributeManager.registerAttribute(new HotbarSelectedSlotAttribute());
