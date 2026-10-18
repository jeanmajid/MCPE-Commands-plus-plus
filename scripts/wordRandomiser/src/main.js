import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { toTitleCase } from "./stringUtils.js";

const DATA_DIRECTORY = "scripts/wordRandomiser/data/";
const OUTPUT_DIRECTORY = "scripts/wordRandomiser/output/";

const TARGET_PATH = "english-nouns";

const WORDS_PER_BATCH = 128;
const TOTAL_BATCHES = 5;

const MAX_WORD_LENGTH = 7;
const MIN_WORD_LENGTH = 3;

mkdirSync(DATA_DIRECTORY, { recursive: true });
const wordData = readFileSync(DATA_DIRECTORY + TARGET_PATH + ".txt", {
    encoding: "utf-8",
}).split("\n");

const outputPath = OUTPUT_DIRECTORY + TARGET_PATH;

for (let batch = 0; batch < TOTAL_BATCHES; ++batch) {
    const words = [];
    for (let i = 0; i < WORDS_PER_BATCH; ++i) {
        const wordIndex = Math.floor(Math.random() * wordData.length);
        const word = wordData[wordIndex];
        wordData.splice(wordIndex, 1);

        if (
            word.includes("-") ||
            word.length > MAX_WORD_LENGTH ||
            word.length <= MIN_WORD_LENGTH
        ) {
            --i;
            continue;
        }
        console.log(word);

        words.push(toTitleCase(word));
    }

    mkdirSync(outputPath, { recursive: true });
    writeFileSync(
        `${outputPath}/${batch}.ts`,
        `export const words = ${JSON.stringify(words, null, 4)}`,
    );
}
