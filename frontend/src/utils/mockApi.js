// src/utils/mockApi.js
//
// Shared helpers used by every "frontend-only" data module (src/data/*)
// and the service/api files that read from them. The goal is that every
// function in src/services and src/api keeps its exact original name,
// params, and return shape — only what happens *inside* changes. That
// way, when a real backend exists again, only these internals need to
// be swapped back to real axios calls; no page or component needs to
// change.

/**
 * Waits briefly so existing loading states (spinners, skeletons,
 * disabled buttons) still have something to show, the same way they
 * would while waiting on a real network request. Kept short on purpose.
 */
export const simulateDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps a plain JS value the same way axios wraps a real HTTP response
 * (`{ data: <body> }`), so existing code that reads `res.data.data...`
 * keeps working without changes.
 */
export const mockResponse = (body) => Promise.resolve({ data: body });

/**
 * Throws an axios-shaped error so existing `catch` blocks and
 * `error.response?.data?.message` reads keep working without changes.
 */
export const mockError = (status, message) => {
  const error = new Error(message);
  error.response = { status, data: { success: false, message } };
  throw error;
};

/**
 * Generates a MongoDB ObjectId-looking 24-char hex string. Purely
 * cosmetic — it just makes dummy records look like they came from a
 * real database, and avoids surprises if any code assumes `_id` is
 * shaped like a Mongo id.
 */
export const generateId = () => {
  const hex = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) id += hex[Math.floor(Math.random() * 16)];
  return id;
};

/**
 * Reads a JSON value from localStorage, falling back safely if the
 * key is missing or the stored value is corrupted.
 */
export const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/**
 * Writes a JSON value to localStorage, ignoring quota/serialization
 * errors instead of crashing the UI.
 */
export const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — safe to ignore.
  }
};

/**
 * Reads a File/Blob as a data URL (base64), used for image upload fields
 * across the admin forms (product thumbnail/gallery, category image).
 */
export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Returns the plain-text version of an i18n `{ en, bn }` field (or
 * passes a plain string through), defaulting to English. Used mainly
 * for search matching across both languages.
 */
export const localizedText = (field, lang = "en") => {
  if (field && typeof field === "object") return field[lang] || field.en || "";
  return field || "";
};

/**
 * A small persisted collection: reads/writes a JSON array under
 * `storageKey`, seeding from `seedData` the first time it's read. Every
 * module that needs the SAME collection (e.g. productApi.js for admin
 * CRUD and productService.js for search) creates its own store with the
 * same storageKey — they're not sharing an object, just agreeing on
 * where the data lives, which keeps modules independent.
 */
export const createLocalStore = (storageKey, seedData) => ({
  read: () => readLocal(storageKey, null) || seedData.map((item) => ({ ...item })),
  write: (items) => writeLocal(storageKey, items),
});

/** Turns "Fresh Red Apple" into "fresh-red-apple", de-duplicating against existing slugs. */
export const slugify = (text, existingSlugs = []) => {
  const base = String(text || "item")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";

  let slug = base;
  let n = 2;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
};

/** Parses a comma-separated tag string ("Fruit, Healthy") into a clean array. */
export const parseTagsInput = (text) =>
  String(text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
