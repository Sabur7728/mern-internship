import fs from "fs/promises";
import crypto from "crypto";

const FILE = "./data/db.json";

export const readDb = async () => JSON.parse(await fs.readFile(FILE, "utf-8"));

export const writeDb = async (data) =>
  fs.writeFile(FILE, JSON.stringify(data, null, 2));

export const newId = () => crypto.randomUUID();
