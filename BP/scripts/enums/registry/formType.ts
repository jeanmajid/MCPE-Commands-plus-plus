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

import { ActionFormData, CustomForm, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { EnumManager } from "../enum.js";

export const FORM_TYPE_ENUM_KEY = "formTypeEnum";
export const FormType: Record<string, unknown> = {
    action: ActionFormData,
    modal: ModalFormData,
    message: MessageFormData,
    custom: CustomForm,
} as const;

EnumManager.register(FORM_TYPE_ENUM_KEY, Object.keys(FormType));
