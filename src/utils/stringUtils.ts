function sanitizeString(str: string): string {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "").trim();
    str = str.replace(/ /g, "-");
    return str;
}

export { sanitizeString };
