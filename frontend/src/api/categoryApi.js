import seedCategories from "../data/categories";
import {
  simulateDelay,
  mockResponse,
  mockError,
  localizedText,
  createLocalStore,
  slugify,
  fileToDataUrl,
  generateId,
} from "../utils/mockApi";

const categoryStore = createLocalStore("localCategories", seedCategories);

// =====================================================================
// FRONTEND-ONLY CONVERSION STATUS
// =====================================================================
// Every function below now reads/writes local dummy data — categories
// added, edited, or deleted here immediately show up (or disappear) on
// the storefront too, since PopularCategories/Shop read from this same
// store. Nothing that calls these functions needed to change.
// =====================================================================

export const createCategory = async (formData) => {
  await simulateDelay(400);

  const get = (key) => formData.get(key);
  const name = JSON.parse(get("name") || "{}");

  const categories = categoryStore.read();
  const slug = slugify(name.en, categories.map((c) => c.slug));

  const imageFile = get("image");
  const imageUrl = imageFile && imageFile.size > 0 ? await fileToDataUrl(imageFile) : "";

  const newCategory = {
    _id: `cat-${generateId()}`,
    name,
    slug,
    description: get("description") || "",
    image: { url: imageUrl },
    isPopular: get("isPopular") === "true" || get("isPopular") === true,
    status: "active",
    productCount: 0,
  };

  categories.push(newCategory);
  categoryStore.write(categories);

  return mockResponse({ success: true, message: "Category created successfully!", data: newCategory });
};

export const getCategories = async (params = {}) => {
  await simulateDelay();

  let result = categoryStore.read().filter((c) => c.status === "active");

  if (params.q) {
    const q = String(params.q).toLowerCase();
    result = result.filter((c) => {
      const name = `${localizedText(c.name, "en")} ${localizedText(c.name, "bn")}`.toLowerCase();
      return name.includes(q);
    });
  }

  if (params.popular === true || params.popular === "true") {
    result = result.filter((c) => c.isPopular);
  }

  if (params.limit) {
    result = result.slice(0, Number(params.limit));
  }

  return mockResponse({ success: true, data: result });
};

export const getAllCategories = (params = {}) => getCategories(params);

export const getSingleCategory = async (slug) => {
  await simulateDelay();

  const category = categoryStore.read().find((c) => c.slug === slug && c.status === "active");

  if (!category) {
    mockError(404, "Category not found");
  }

  // Note: wrapped as { category } (not the category directly) — this
  // matches what EditCategory.jsx actually reads (res.data.data.category).
  return mockResponse({ success: true, data: { category } });
};

export const updateCategory = async (id, formData) => {
  await simulateDelay(400);

  const categories = categoryStore.read();
  const category = categories.find((c) => c._id === id);
  if (!category) {
    mockError(404, "Category not found");
  }

  const get = (key) => formData.get(key);
  category.name = JSON.parse(get("name") || "{}");
  category.description = get("description") || "";
  category.isPopular = get("isPopular") === "true" || get("isPopular") === true;

  const imageFile = get("image");
  if (imageFile && imageFile.size > 0) {
    category.image = { url: await fileToDataUrl(imageFile) };
  }

  categoryStore.write(categories);

  return mockResponse({ success: true, message: "Category updated successfully!", data: category });
};

export const deleteCategory = async (id) => {
  await simulateDelay(300);

  const categories = categoryStore.read().filter((c) => c._id !== id);
  categoryStore.write(categories);

  return mockResponse({ success: true, message: "Category deleted successfully." });
};
