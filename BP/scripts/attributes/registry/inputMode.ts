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
    InputMode,
    PlayerInputModeChangeAfterEvent,
    ScoreboardObjective,
    world,
} from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

const inputModeIndex = {
    [InputMode.Gamepad]: 0,
    [InputMode.KeyboardAndMouse]: 1,
    [InputMode.MotionController]: 2,
    [InputMode.Touch]: 3,
};

class InputModeAttribute extends BaseAttribute {
    public id = "inputMode";
    public event?: (arg0: PlayerInputModeChangeAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.playerInputModeChange.subscribe(
            ({ player, newInputModeUsed }) => {
                this.score.setScore(player, inputModeIndex[newInputModeUsed]);
            }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            const inputMode = player.inputInfo.lastInputModeUsed;

            score.setScore(player, inputModeIndex[inputMode]);
        }
    }

    public cleanup(): void {
        world.afterEvents.playerInputModeChange.unsubscribe(this.event!);
    }
}

AttributeManager.register(new InputModeAttribute());
