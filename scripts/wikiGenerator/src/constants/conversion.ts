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

export const ENUM_CONVERSION: Record<string, Record<string, string>> = {
    CommandPermissionLevel: {
        Any: "Everyone",
        GameDirectors: "Operators and Command Blocks",
        Admin: "Operator",
    },
    CustomCommandParamType: {
        Enum: "Enum",
        String: "String",
        BlockType: "Block",
        Location: "Location",
        Integer: "Integer",
        EntitySelector: "Entity",
        Float: "Float",
        Boolean: "Boolean",
        PlayerSelector: "Player",
        ItemType: "Item",
        EntityType: "EntityType",
    },
};
