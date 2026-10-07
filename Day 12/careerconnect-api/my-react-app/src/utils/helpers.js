export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "Invalid ID");
  return id;
}

export const has = (text, q) =>
  String(text).toLowerCase().includes(String(q).toLowerCase());

export const same = (a, b) =>
  String(a).toLowerCase() === String(b).toLowerCase();

export const nextId = (list) =>
  list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1;

export const pick = (data, fields) =>
  Object.fromEntries(
    fields.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );