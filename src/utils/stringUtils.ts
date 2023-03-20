/**
 *
 * Sanitizes the given string by removing all non-alphanumeric characters,
 * replacing spaces with dashes and trimming any leading/trailing spaces.
 *
 * @param str - The string to be sanitized
 * @returns The sanitized string with only alphanumeric characters, dashes,
 *  periods, underscores, commas, and spaces.
 */
function sanitizeString(str: string): string {
    // Remove all non-alphanumeric characters except spaces, periods,
    // underscores, commas, and dashes
    str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, "").trim();

    // Replace spaces with dashes
    str = str.replace(/ /g, "-");

    return str;
}
