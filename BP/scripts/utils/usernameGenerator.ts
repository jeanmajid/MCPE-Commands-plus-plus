import { USERNAME_AMBIFIXES } from "../constants/nameFragments/ambifixes.js";
import { CHAR_SUBSTITUTES } from "../constants/nameFragments/charSubstitutes.js";
import { Random } from "./number.js";

let nounList: string[] = [];
let adjectivesList: string[] = [];

const AVAILABLE_BATCH_COUNT = 4;
const RANDOM_AMBIFIX_CHANCE = 0.1;
const RANDOM_NUMBER_SUFFIX_CHANCE = 0.25;
const RANDOM_SEPARATOR_CHANCE = 0.08;
const INITIATE_CHAR_REPLACER_CHANCE = 0.5;
const PER_CHAR_REPLACER_CHANCE = 0.175;

export async function cacheUsernameTables(): Promise<void> {
    if (nounList.length === 0) {
        nounList = (
            (await Random.importFromDir(
                "../constants/nameFragments/nouns/",
                AVAILABLE_BATCH_COUNT
            )) as Record<string, string[]>
        ).words;
    }

    if (adjectivesList.length === 0) {
        adjectivesList = (
            (await Random.importFromDir(
                "../constants/nameFragments/adjectives/",
                AVAILABLE_BATCH_COUNT
            )) as Record<string, string[]>
        ).words;
    }
}

export function generateRandomUsername(): string {
    const randomAdjective = Random.arrayElement(adjectivesList);
    const randomNoun = Random.arrayElement(nounList);
    let randomNumberSuffix: string | number = "";
    let randomPrefix = "";
    let randomSuffix = "";
    let separator = "";

    if (Math.random() < RANDOM_AMBIFIX_CHANCE) {
        randomPrefix = Random.arrayElement(USERNAME_AMBIFIXES);
    }

    if (Math.random() < RANDOM_AMBIFIX_CHANCE) {
        randomSuffix = Random.arrayElement(USERNAME_AMBIFIXES);
    }

    if (Math.random() < RANDOM_NUMBER_SUFFIX_CHANCE) {
        randomNumberSuffix = Random.intRange(0, 9999);
    }

    if (Math.random() < RANDOM_SEPARATOR_CHANCE) {
        separator = " ";
    }

    let name =
        randomPrefix + randomAdjective + separator + randomNoun + randomSuffix + randomNumberSuffix;

    if (Math.random() < INITIATE_CHAR_REPLACER_CHANCE) {
        const mutatedName = [];
        for (const char of name) {
            let replace = CHAR_SUBSTITUTES[char];
            if (!replace) {
                mutatedName.push(char);
                continue;
            }

            if (Math.random() > PER_CHAR_REPLACER_CHANCE) {
                mutatedName.push(char);
                continue;
            }

            if (typeof replace === "object") {
                replace = Random.arrayElement(replace);
            }
            mutatedName.push(replace);
        }
        name = mutatedName.join("");
    }
    return name;
}
