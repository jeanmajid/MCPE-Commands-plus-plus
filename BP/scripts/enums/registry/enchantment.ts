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
