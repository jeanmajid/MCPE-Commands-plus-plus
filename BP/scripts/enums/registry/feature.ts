/* SPDX-License-Identifier =PolyForm-Noncommercial-1.0.0
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

export const BIOME_TYPE_ENUM_KEY = "biomeTypeEnum";
export enum FeatureId {
    AbandonedCampBambooJungle = "minecraft:abandoned_camp_bamboo_jungle",
    AbandonedCampBirchForest = "minecraft:abandoned_camp_birch_forest",
    AbandonedCampCherryGrove = "minecraft:abandoned_camp_cherry_grove",
    AbandonedCampDappledForest = "minecraft:abandoned_camp_dappled_forest",
    AbandonedCampExtremeHillsPlusTrees = "minecraft:abandoned_camp_extreme_hills_plus_trees",
    AbandonedCampFlowerForest = "minecraft:abandoned_camp_flower_forest",
    AbandonedCampPaleGarden = "minecraft:abandoned_camp_pale_garden",
    AbandonedCampSwampland = "minecraft:abandoned_camp_swampland",
    AncientCity = "minecraft:ancient_city",
    BastionRemnant = "minecraft:bastion_remnant",
    BuriedTreasure = "minecraft:buried_treasure",
    EndCity = "minecraft:end_city",
    Fortress = "minecraft:fortress",
    Mansion = "minecraft:mansion",
    Mineshaft = "minecraft:mineshaft",
    Monument = "minecraft:monument",
    PillagerOutpost = "minecraft:pillager_outpost",
    RuinedPortal = "minecraft:ruined_portal",
    Ruins = "minecraft:ruins",
    Shipwreck = "minecraft:shipwreck",
    Stronghold = "minecraft:stronghold",
    Temple = "minecraft:temple",
    TrailRuins = "minecraft:trail_ruins",
    TrialChambers = "minecraft:trial_chambers",
    Village = "minecraft:village",
}

EnumManager.register(BIOME_TYPE_ENUM_KEY, Object.values(FeatureId));
