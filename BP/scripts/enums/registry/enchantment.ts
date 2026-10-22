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

import { EnumManager } from "../enum.js";

export const ENCHANTMENT_ENUM_KEY = "enchantmentEnum";
export enum Enchantment {
    aquaAffinity = "aqua_affinity",
    baneOfArthropods = "bane_of_arthropods",
    binding = "binding",
    blastProtection = "blast_protection",
    infinity = "infinity",
    breach = "breach",
    channeling = "channeling",
    density = "density",
    depthStrider = "depth_strider",
    efficiency = "efficiency",
    featherFalling = "feather_falling",
    fireAspect = "fire_aspect",
    fireProtection = "fire_protection",
    flame = "flame",
    fortune = "fortune",
    frostWalker = "frost_walker",
    impaling = "impaling",
    knockback = "knockback",
    looting = "looting",
    loyalty = "loyalty",
    luckOfTheSea = "luck_of_the_sea",
    lunge = "lunge",
    lure = "lure",
    mending = "mending",
    multishot = "multishot",
    piercing = "piercing",
    power = "power",
    projectileProtection = "projectile_protection",
    protection = "protection",
    punch = "punch",
    quickCharge = "quick_charge",
    respiration = "respiration",
    riptide = "riptide",
    sharpness = "sharpness",
    silkTouch = "silk_touch",
    smite = "smite",
    soulSpeed = "soul_speed",
    swiftSneak = "swift_sneak",
    thorns = "thorns",
    unbreaking = "unbreaking",
    vanishing = "vanishing",
    windBurst = "wind_burst",
}

EnumManager.register(ENCHANTMENT_ENUM_KEY, Object.values(Enchantment));
