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
    ButtonState,
    InputButton,
    PlayerButtonInputAfterEvent,
    ScoreboardObjective,
    world,
} from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

class InputKeyJumpAttribute extends BaseAttribute {
    public id = "inputKeyJump";
    public event?: (arg0: PlayerButtonInputAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.playerButtonInput.subscribe(
            ({ newButtonState, player }) => {
                this.score.setScore(player, newButtonState === ButtonState.Pressed ? 1 : 0);
            },
            { buttons: [InputButton.Jump] }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            const sneakInputState = player.inputInfo.getButtonState(InputButton.Sneak);

            score.setScore(player, sneakInputState === ButtonState.Pressed ? 1 : 0);
        }
    }

    public cleanup(): void {
        world.afterEvents.playerButtonInput.unsubscribe(this.event!);
    }
}

AttributeManager.register(new InputKeyJumpAttribute());
