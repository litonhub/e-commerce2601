// src/services/productService.js
//
// Thin, read-only helpers used by header search suggestions. Reads
// from the same stateful product store as src/api/productApi.js (same
// storageKey, "localProducts"), so admin edits/deletes are reflected
// here too. Function names and return shapes are unchanged, so nothing
// that imports them (useProducts hook, MainHeader search) needed to change.

import seedProducts from "../data/products";
import { simulateDelay, localizedText, createLocalStore } from "../utils/mockApi";

const productStore = createLocalStore("localProducts", seedProducts);

export const getProducts = async (search = "") => {
  await simulateDelay();

  let result = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => {
      const title = `${localizedText(p.title, "en")} ${localizedText(p.title, "bn")}`.toLowerCase();
      return title.includes(q);
    });
  }

  return result.slice(0, 100);
};

export const getSearchSuggestions = async (keyword) => {
  if (!keyword) return [];

  await simulateDelay(200);

  const q = keyword.toLowerCase();

  return productStore
    .read()
    .filter((p) => p.status === "active" && p.isActive !== false)
    .filter((p) => {
      const title = `${localizedText(p.title, "en")} ${localizedText(p.title, "bn")}`.toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      return title.includes(q) || brand.includes(q) || p.category.toLowerCase().includes(q);
    })
    .slice(0, 6);
};
