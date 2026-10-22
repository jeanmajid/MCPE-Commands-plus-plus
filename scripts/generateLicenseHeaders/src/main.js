import { appendFileSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const licenseText = `/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
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
 */`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandsPPPath = "../../BP";
const commandsPPPathWikiGenerator = "../wikiGenerator/src";

recursiveReadFolder(commandsPPPath);
recursiveReadFolder(commandsPPPathWikiGenerator);

/**
 * @param {import("node:fs").PathLike} folderPath
 * @returns {void}
 */
function recursiveReadFolder(folderPath) {
    for (const path of readdirSync(folderPath).map((p) => join(folderPath, p))) {
        recursiveRead(path);
    }
}

/**
 * @param {import("node:fs").PathLike} path
 * @returns {void}
 */
function recursiveRead(path) {
    if (statSync(path).isDirectory()) {
        recursiveReadFolder(path);
    } else {
        processFile(path);
    }
}

processFile("../../app/src/main.cpp");

/**
 * @param {import("node:fs").PathLike} path
 * @returns {void}
 */
function processFile(path) {
    if (!path.endsWith(".json") && !path.endsWith(".ts") && !path.endsWith(".js")) {
        return;
    }

    let fileContents = readFileSync(path, { encoding: "utf-8" });

    fileContents = cleanOldLicenseText(fileContents);

    writeFileSync(path, licenseText);
    appendFileSync(path, "\n\n");
    appendFileSync(path, fileContents);
}

/**
 * @param {string} fileContents
 * @returns {string}
 */
function cleanOldLicenseText(fileContents) {
    if (!fileContents.startsWith("/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0")) {
        return fileContents;
    }

    const fileLineByLine = fileContents.split("\n");

    let i = 1;
    for (const line of fileLineByLine) {
        if (line.startsWith(" */")) {
            const start = fileLineByLine[i] === "" ? i + 1 : i;
            return fileLineByLine.splice(start, fileLineByLine.length).join("\n");
        }
        ++i;
    }
}
