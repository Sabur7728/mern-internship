import { readFile } from "node:fs/promises";

export async function readJsonFile(filePath) {
    const file = await readFile(filePath, "utf8");

    return JSON.parse(file);
}