// src/services/categoryService.js
//
// Now reads from local dummy data instead of the real backend. Keeps
// its original name and return shape (a plain category array), so
// nothing that imports it needed to change.

import categories from "../data/categories";
import { simulateDelay } from "../utils/mockApi";

export const getCategories = async () => {
  await simulateDelay();
  return categories.filter((c) => c.status === "active");
};
