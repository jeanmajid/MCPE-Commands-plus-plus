/**
 * Returns a boolean indicating if the provided string includes any keyword from a list of keywords.
 * @param {string} string
 * @param {string[]} keywords
 * @returns {boolean}
 */
export function isAnySubstringInString(string, keywords) {
    for (const keyword of keywords) {
        if (string.includes(keyword)) {
            return true;
        }
    }
    return false;
}

/**
 * Returns a boolean indicating if any perfectly matching string is found in a list of comparison strings.
 * @param {string} string
 * @param {string[]} comparisons
 * @returns {boolean}
 */
export function isAnyStringMatching(string, comparisons) {
    for (const string2 of comparisons) {
        if (string2 === string) {
            return true;
        }
    }
    return false;
}

/**
 * Returns the first instance of a string in a list that includes the provided substring.
 * @param {string} searchKey
 * @param {string[]} list
 * @returns {string}
 */
export function findSubstringInList(searchKey, list) {
    for (const line of list) {
        if (line.includes(searchKey)) {
            return line;
        }
    }
}

/**
 * Returns the value of the first key found where the search key includes the key.
 * @param {string} searchKey
 * @param {Record<string, any>} object
 * @returns {any}
 */
export function findSubstringInObjectKeys(searchKey, object) {
    for (const [key, value] of Object.entries(object)) {
        if (searchKey.includes(key)) {
            return value;
        }
    }
}

/**
 * Returns a transformed string in title case format.
 *
 * Replaces underscores with spaces and capitalises the first letter of each word.
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase(string) {
    return string
        .replaceAll("_", " ")
        .replaceAll(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Returns a modified version of an existing translation key.
 *
 * Replaces the search value with a new value and appends a suffix.
 * @param {string} key
 * @param {string} searchKey
 * @param {string} returnKey
 */
export function replaceTranslationKey(key, searchKey, returnKey, suffix) {
    return key.replace(searchKey, returnKey) + ` ${toTitleCase(suffix)}`;
}

/**
 * Generates a new translation key using the block identifier and a translation key.
 *
 * The output will be formatted such as 'tile.example_block_id.name=Example Block Id'
 * @param {string} newBlockId
 * @param {string} returnKey
 * @returns {string}
 */
export function generateTranslationKey(blockId, translationKey) {
    const displayName = toTitleCase(blockId);
    return translationKey + "=" + displayName;
}
