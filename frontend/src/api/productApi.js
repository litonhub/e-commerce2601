import seedProducts from "../data/products";
import {
  simulateDelay,
  mockResponse,
  mockError,
  localizedText,
  createLocalStore,
  slugify,
  parseTagsInput,
  fileToDataUrl,
  generateId,
  readLocal,
  writeLocal,
} from "../utils/mockApi";

const productStore = createLocalStore("localProducts", seedProducts);

// =====================================================================
// FRONTEND-ONLY CONVERSION STATUS
// =====================================================================
// Every function below now reads/writes local dummy data — products
// added, edited, soft-deleted, restored, or permanently deleted here
// immediately show up (or disappear) on the storefront too, since the
// storefront reads from this same store (see productService.js and
// getProducts/getSingleProduct below). Nothing that calls these
// functions (Shop, ProductDetails, homepage sections, Products,
// AddProduct, EditProduct, RecycleBinProducts) needed to change.
//
// Bulk CSV/Excel import, bulk image upload, and analytics further down
// this file are still real `api` calls — that's the next phase (bulk
// tools + analytics), not this one.
// =====================================================================

// ============================
// CREATE PRODUCT
// ============================

export const createProduct = async (formData) => {
  await simulateDelay(500);

  const get = (key) => formData.get(key);
  const getBool = (key) => get(key) === "true" || get(key) === true;

  const products = productStore.read();
  const titleEn = get("title[en]") || "";
  const slug = slugify(titleEn, products.map((p) => p.slug));

  const thumbnailFile = get("thumbnail");
  const thumbnailUrl = thumbnailFile && thumbnailFile.size > 0 ? await fileToDataUrl(thumbnailFile) : "";

  const imageFiles = formData.getAll("images").filter((f) => f && f.size > 0);
  const imageUrls = await Promise.all(imageFiles.map(fileToDataUrl));

  const newProduct = {
    _id: `prod-${generateId()}`,
    slug,
    title: { en: titleEn, bn: get("title[bn]") || "" },
    description: { en: get("description[en]") || "", bn: get("description[bn]") || "" },
    shortDescription: { en: get("description[en]") || "", bn: get("description[bn]") || "" },
    tags: parseTagsInput(get("tags[en]")),
    price: Number(get("price")) || 0,
    discountPercentage: Number(get("discountPercentage")) || 0,
    currency: "BDT",
    category: (get("category") || "").toLowerCase(),
    categoryId: "",
    brand: get("brand") || "",
    sku: get("sku") || "",
    stock: Number(get("stock")) || 0,
    weight: get("weight") || "",
    unit: "",
    rating: Number(get("rating")) || 5,
    averageRating: Number(get("rating")) || 5,
    totalRatings: 0,
    thumbnail: { url: thumbnailUrl },
    images: imageUrls.map((url) => ({ url })),
    featured: getBool("featured"),
    bestSeller: getBool("bestSeller"),
    popular: getBool("popular"),
    hotDeals: getBool("hotDeals"),
    status: "active",
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  productStore.write(products);

  return mockResponse({ success: true, message: "Product created successfully!", data: newProduct });
};

// ============================
// GET ALL PRODUCTS
// ============================

export const getProducts = async (params = {}) => {
  await simulateDelay();

  let result = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);

  if (params.q) {
    const q = String(params.q).toLowerCase();
    result = result.filter((p) => {
      const title = `${localizedText(p.title, "en")} ${localizedText(p.title, "bn")}`.toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();
      return (
        title.includes(q) ||
        brand.includes(q) ||
        tags.includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }

  if (params.category && params.category !== "All") {
    const cat = String(params.category).toLowerCase();
    result = result.filter((p) => p.category.toLowerCase() === cat);
  }

  if (params.minPrice !== undefined && params.minPrice !== "") {
    result = result.filter((p) => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice !== undefined && params.maxPrice !== "") {
    result = result.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.rating) {
    result = result.filter((p) => (p.averageRating || p.rating || 0) >= Number(params.rating));
  }

  if (params.tag) {
    const tag = String(params.tag).toLowerCase();
    result = result.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag));
  }

  if (params.isDiscounted === true || params.isDiscounted === "true") {
    result = result.filter((p) => p.discountPercentage > 0);
  }
  if (params.hotDeals === true || params.hotDeals === "true") {
    result = result.filter((p) => p.hotDeals);
  }
  if (params.bestSeller === true || params.bestSeller === "true") {
    result = result.filter((p) => p.bestSeller);
  }
  if (params.popular === true || params.popular === "true") {
    result = result.filter((p) => p.popular);
  }

  const sortBy = params.sort;
  if (!params.q) {
    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "oldest":
        result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "top-rated":
        result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "best-selling":
        result = [...result].sort((a, b) => (b.bestSeller === true) - (a.bestSeller === true));
        break;
      case "new-arrivals":
      case "latest":
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  const totalProducts = result.length;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;
  const start = (page - 1) * limit;
  const paginatedProducts = result.slice(start, start + limit);

  return mockResponse({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        totalProducts,
        total: totalProducts,
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
        hasNextPage: start + limit < totalProducts,
        hasPrevPage: page > 1,
      },
    },
  });
};

// ============================
// GET SINGLE PRODUCT BY SLUG
// ============================

export const getSingleProduct = async (slug) => {
  await simulateDelay();

  const allProducts = productStore.read();
  const product = allProducts.find((p) => p.slug === slug && p.status === "active" && p.isActive !== false);

  if (!product) {
    mockError(404, "Product not found");
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id && p.status === "active" && p.isActive !== false)
    .slice(0, 4);

  return mockResponse({
    success: true,
    data: {
      product,
      relatedProducts,
    },
  });
};

// ============================
// GET PRODUCT BY ID ADMIN
// ============================

export const getProductById = async (id) => {
  await simulateDelay();

  const product = productStore.read().find((p) => p._id === id);
  if (!product) {
    mockError(404, "Product not found");
  }

  return mockResponse({ success: true, data: product });
};

// ============================
// UPDATE PRODUCT
// ============================

export const updateProduct = async (id, formData) => {
  await simulateDelay(500);

  const products = productStore.read();
  const product = products.find((p) => p._id === id);
  if (!product) {
    mockError(404, "Product not found");
  }

  const get = (key) => formData.get(key);
  const getBool = (key) => get(key) === "true" || get(key) === true;

  product.title = { en: get("title[en]") || "", bn: get("title[bn]") || "" };
  product.description = { en: get("description[en]") || "", bn: get("description[bn]") || "" };
  product.shortDescription = product.description;
  product.tags = parseTagsInput(get("tags[en]"));
  product.price = Number(get("price")) || 0;
  product.discountPercentage = Number(get("discountPercentage")) || 0;
  product.category = (get("category") || product.category || "").toLowerCase();
  product.brand = get("brand") || "";
  product.stock = Number(get("stock")) || 0;
  product.sku = get("sku") || "";
  product.weight = get("weight") || "";
  product.rating = Number(get("rating")) || product.rating;
  product.averageRating = product.rating;
  product.featured = getBool("featured");
  product.bestSeller = getBool("bestSeller");
  product.popular = getBool("popular");
  product.hotDeals = getBool("hotDeals");
  // Slug is intentionally left unchanged on edit, same as most real
  // backends — existing links to this product keep working.

  const thumbnailFile = get("thumbnail");
  if (thumbnailFile && thumbnailFile.size > 0) {
    product.thumbnail = { url: await fileToDataUrl(thumbnailFile) };
  }

  const imageFiles = formData.getAll("images").filter((f) => f && f.size > 0);
  if (imageFiles.length > 0) {
    const imageUrls = await Promise.all(imageFiles.map(fileToDataUrl));
    product.images = imageUrls.map((url) => ({ url }));
  }

  productStore.write(products);

  return mockResponse({ success: true, message: "Product updated successfully!", data: product });
};

// ============================
// SOFT DELETE
// ============================

export const deleteProduct = async (id) => {
  await simulateDelay(300);

  const products = productStore.read();
  const product = products.find((p) => p._id === id);
  if (!product) {
    mockError(404, "Product not found");
  }

  product.status = "deleted";
  product.deletedAt = new Date().toISOString();
  productStore.write(products);

  return mockResponse({ success: true, message: "Product moved to recycle bin." });
};

// ============================
// RESTORE
// ============================

export const restoreProduct = async (id) => {
  await simulateDelay(300);

  const products = productStore.read();
  const product = products.find((p) => p._id === id);
  if (!product) {
    mockError(404, "Product not found");
  }

  product.status = "active";
  delete product.deletedAt;
  productStore.write(products);

  return mockResponse({ success: true, message: "Product restored." });
};

// ============================
// PERMANENT DELETE
// ============================

export const permanentDeleteProduct = async (id) => {
  await simulateDelay(300);

  const products = productStore.read().filter((p) => p._id !== id);
  productStore.write(products);

  return mockResponse({ success: true, message: "Product permanently deleted." });
};

// ============================
// STATUS UPDATE
// ============================

export const updateProductStatus = async (id, data = {}) => {
  await simulateDelay(300);

  const products = productStore.read();
  const product = products.find((p) => p._id === id);
  if (!product) {
    mockError(404, "Product not found");
  }

  if (data.status) product.status = data.status;
  productStore.write(products);

  return mockResponse({ success: true, message: "Product status updated.", data: product });
};

// ============================
// RECYCLE BIN
// ============================

export const getRecycleBinProducts = async (params = {}) => {
  await simulateDelay();

  let result = productStore.read().filter((p) => p.status === "deleted");

  if (params.q) {
    const q = String(params.q).toLowerCase();
    result = result.filter((p) => localizedText(p.title, "en").toLowerCase().includes(q));
  }

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  return mockResponse({
    success: true,
    data: {
      products: paginated,
      pagination: {
        totalProducts: result.length,
        total: result.length,
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(result.length / limit)),
      },
    },
  });
};

// ============================
// BULK RESTORE / PERMANENT DELETE (recycle bin bulk actions)
// ============================

export const bulkRestoreProducts = async (data = {}) => {
  await simulateDelay(400);

  const ids = data.ids || data.productIds || [];
  const products = productStore.read();
  products.forEach((p) => {
    if (ids.includes(p._id)) {
      p.status = "active";
      delete p.deletedAt;
    }
  });
  productStore.write(products);

  return mockResponse({ success: true, message: `${ids.length} product(s) restored.` });
};

export const bulkPermanentDeleteProducts = async (data = {}) => {
  await simulateDelay(400);

  const ids = data.ids || data.productIds || [];
  const products = productStore.read().filter((p) => !ids.includes(p._id));
  productStore.write(products);

  return mockResponse({ success: true, message: `${ids.length} product(s) permanently deleted.` });
};

// =====================================================================
// BULK TOOLS — shared helpers
// =====================================================================
// CSV and Excel import both parse down to the same flat row shape, so
// they share this row -> product mapper. Column names are ours to
// define (see the template generators below) — pick whatever a real
// backend's bulk-import endpoint would reasonably expect.

const buildProductFromRow = (row, existingSlugs) => {
  const get = (key) => (row[key] ?? "").toString().trim();
  const titleEn = get("title_en");
  const category = get("category").toLowerCase();
  const price = Number(get("price"));
  const stock = Number(get("stock"));

  if (!titleEn) return { error: "Missing title_en" };
  if (!category) return { error: "Missing category" };
  if (!price || Number.isNaN(price) || price <= 0) return { error: "Invalid or missing price" };
  if (get("stock") !== "" && Number.isNaN(stock)) return { error: "Invalid stock" };

  const slug = slugify(titleEn, existingSlugs);
  existingSlugs.push(slug);

  return {
    product: {
      _id: `prod-${generateId()}`,
      slug,
      title: { en: titleEn, bn: get("title_bn") },
      description: { en: get("description_en"), bn: get("description_bn") },
      shortDescription: { en: get("description_en"), bn: get("description_bn") },
      tags: parseTagsInput(get("tags_en")),
      price,
      discountPercentage: Number(get("discountPercentage")) || 0,
      currency: "BDT",
      category,
      categoryId: "",
      brand: get("brand"),
      sku: get("sku"),
      stock: Number.isNaN(stock) ? 0 : stock,
      weight: get("weight"),
      unit: "",
      rating: 5,
      averageRating: 5,
      totalRatings: 0,
      thumbnail: { url: "" },
      images: [],
      featured: false,
      bestSeller: false,
      popular: false,
      hotDeals: false,
      isActive: true,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  };
};

const TEMPLATE_COLUMNS = [
  "title_en", "title_bn", "description_en", "description_bn", "tags_en",
  "category", "brand", "price", "discountPercentage", "stock", "sku", "weight",
];
const TEMPLATE_EXAMPLE_ROW = [
  "Fresh Red Apple", "লাল আপেল", "Crisp, juicy red apples.", "লাল আপেল।", "Fruit, Healthy",
  "fresh fruit", "FreshMart", "220", "0", "40", "FRU-APL-99", "1 kg",
];

const importRows = (rows) => {
  const products = productStore.read();
  const existingSlugs = products.map((p) => p.slug);
  const createdProducts = [];
  const failedProducts = [];

  rows.forEach((row) => {
    const { product, error } = buildProductFromRow(row, existingSlugs);
    if (error) {
      failedProducts.push({ title: row.title_en || row.title || "", reason: error });
    } else {
      products.push(product);
      createdProducts.push({ _id: product._id, title: product.title.en });
    }
  });

  productStore.write(products);

  return {
    created: createdProducts.length,
    failed: failedProducts.length,
    total: rows.length,
    createdProducts,
    failedProducts,
  };
};

// =================================================
// BULK IMAGE UPLOAD (stored as base64, no Cloudinary)
// =================================================

const UPLOADED_IMAGES_KEY = "localUploadedImages";

export const bulkUploadImages = async (formData) => {
  await simulateDelay(600);

  const files = formData.getAll("images").filter((f) => f && f.size > 0);
  const images = await Promise.all(
    files.map(async (file) => ({ url: await fileToDataUrl(file), filename: file.name }))
  );

  writeLocal(UPLOADED_IMAGES_KEY, images);

  return mockResponse({
    success: true,
    message: `${images.length} images uploaded successfully.`,
    data: { images, total: images.length },
  });
};

// =================================================
// BULK CREATE PRODUCTS (manual multi-row form)
// =================================================

export const bulkCreateProducts = async (formData) => {
  await simulateDelay(700);

  const rows = [];
  for (let i = 0; formData.get(`products[${i}][title][en]`) !== null; i++) {
    const key = (field) => formData.get(`products[${i}][${field}]`);
    const thumbnailFile = key("thumbnail");
    const imageFiles = formData.getAll(`products[${i}][images]`).filter((f) => f && f.size > 0);

    rows.push({
      title_en: key("title][en"),
      title_bn: key("title][bn"),
      description_en: key("description][en"),
      description_bn: key("description][bn"),
      tags_en: key("tags][en"),
      category: key("category"),
      brand: key("brand"),
      price: key("price"),
      stock: key("stock"),
      _thumbnailFile: thumbnailFile,
      _imageFiles: imageFiles,
    });
  }

  // Build products the normal way first (also handles validation/slugs)…
  const products = productStore.read();
  const existingSlugs = products.map((p) => p.slug);
  const createdProducts = [];
  const failedProducts = [];

  for (const row of rows) {
    const { product, error } = buildProductFromRow(row, existingSlugs);
    if (error) {
      failedProducts.push({ title: row.title_en || "", reason: error });
      continue;
    }
    // …then attach the actual uploaded thumbnail/images, since those
    // aren't part of the shared CSV/Excel row shape.
    if (row._thumbnailFile) product.thumbnail = { url: await fileToDataUrl(row._thumbnailFile) };
    if (row._imageFiles?.length) {
      product.images = await Promise.all(row._imageFiles.map(async (f) => ({ url: await fileToDataUrl(f) })));
    }
    products.push(product);
    createdProducts.push({ _id: product._id, title: product.title.en });
  }

  productStore.write(products);

  return mockResponse({
    success: true,
    message: `${createdProducts.length} of ${rows.length} product(s) created.`,
    data: { created: createdProducts.length, failed: failedProducts.length, total: rows.length, createdProducts, failedProducts },
  });
};

// =================================================
// BULK STATUS (activate / deactivate — distinct from soft-delete)
// =================================================

export const bulkUpdateProductStatus = async (data = {}) => {
  await simulateDelay(400);

  const ids = data.ids || [];
  const isActive = data.status?.isActive;
  const products = productStore.read();
  products.forEach((p) => {
    if (ids.includes(p._id)) p.isActive = isActive;
  });
  productStore.write(products);

  return mockResponse({ success: true, message: `${ids.length} product(s) updated.` });
};

// =================================================
// BULK DELETE (soft-delete many at once)
// =================================================

export const bulkDeleteProducts = async (data = {}) => {
  await simulateDelay(400);

  const ids = data.ids || [];
  const products = productStore.read();
  products.forEach((p) => {
    if (ids.includes(p._id)) {
      p.status = "deleted";
      p.deletedAt = new Date().toISOString();
    }
  });
  productStore.write(products);

  return mockResponse({ success: true, message: `${ids.length} product(s) deleted.` });
};

// =================================================
// CSV IMPORT (papaparse)
// =================================================

export const importProductsFromCsv = async (formData) => {
  await simulateDelay(800);

  const file = formData.get("file");
  const text = await file.text();
  const Papa = (await import("papaparse")).default;
  const { data: rows } = Papa.parse(text, { header: true, skipEmptyLines: true });

  const result = importRows(rows);
  return mockResponse({ success: true, message: `Imported ${result.created} of ${result.total} product(s).`, data: result });
};

// =================================================
// EXCEL IMPORT (xlsx)
// =================================================

export const importProductsFromExcel = async (formData) => {
  await simulateDelay(800);

  const file = formData.get("file");
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const result = importRows(rows);
  return mockResponse({ success: true, message: `Imported ${result.created} of ${result.total} product(s).`, data: result });
};

// =================================================
// DOWNLOAD CSV TEMPLATE
// =================================================

export const downloadCsvTemplate = async () => {
  await simulateDelay(200);
  const Papa = (await import("papaparse")).default;
  const csv = Papa.unparse([TEMPLATE_COLUMNS, TEMPLATE_EXAMPLE_ROW]);
  return mockResponse(csv);
};

// =================================================
// DOWNLOAD EXCEL TEMPLATE
// =================================================

export const downloadExcelTemplate = async () => {
  await simulateDelay(200);
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, TEMPLATE_EXAMPLE_ROW]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Products");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return mockResponse(buffer);
};

// =================================================
// DOWNLOAD UPLOADED IMAGE LINKS
// =================================================

export const downloadUploadedImageLinks = async () => {
  await simulateDelay(200);
  const images = readLocal(UPLOADED_IMAGES_KEY, []);
  const Papa = (await import("papaparse")).default;
  const csv = Papa.unparse(images.map((img) => ({ filename: img.filename, url: img.url })));
  return mockResponse(csv);
};

// =================================================
// FAILED IMPORT REPORT
// =================================================

export const downloadFailedImportReport = async (data) => {
  await simulateDelay(200);
  const Papa = (await import("papaparse")).default;
  const csv = Papa.unparse((data?.failedProducts || []).map((f) => ({ title: f.title, reason: f.reason })));
  return mockResponse(csv);
};

// =================================================
// ANALYTICS
// =================================================
// Nothing in the original app consumed these yet (no Analytics page
// existed) — implemented properly anyway since the admin-analytics
// phase builds one now.

export const getProductStats = async () => {
  await simulateDelay();

  const products = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const averagePrice = totalProducts ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  return mockResponse({
    success: true,
    data: { totalProducts, totalStockValue, averagePrice, outOfStock, lowStock },
  });
};

export const getInventoryAnalytics = async () => {
  await simulateDelay();

  const products = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);
  const inStock = products.filter((p) => p.stock > 10).length;
  const lowStockProducts = products
    .filter((p) => p.stock > 0 && p.stock <= 10)
    .map((p) => ({ _id: p._id, title: localizedText(p.title, "en"), stock: p.stock }));
  const outOfStockProducts = products
    .filter((p) => p.stock === 0)
    .map((p) => ({ _id: p._id, title: localizedText(p.title, "en") }));

  return mockResponse({
    success: true,
    data: {
      inStock,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
    },
  });
};

export const getCategoryAnalytics = async () => {
  await simulateDelay();

  const products = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);
  const byCategory = {};
  products.forEach((p) => {
    const key = p.category || "uncategorized";
    if (!byCategory[key]) byCategory[key] = { category: key, productCount: 0, totalStock: 0, totalValue: 0 };
    byCategory[key].productCount += 1;
    byCategory[key].totalStock += p.stock;
    byCategory[key].totalValue += p.price * p.stock;
  });

  return mockResponse({ success: true, data: Object.values(byCategory).sort((a, b) => b.productCount - a.productCount) });
};

export const getBrandAnalytics = async () => {
  await simulateDelay();

  const products = productStore.read().filter((p) => p.status === "active" && p.isActive !== false);
  const byBrand = {};
  products.forEach((p) => {
    const key = p.brand || "Unbranded";
    if (!byBrand[key]) byBrand[key] = { brand: key, productCount: 0 };
    byBrand[key].productCount += 1;
  });

  return mockResponse({ success: true, data: Object.values(byBrand).sort((a, b) => b.productCount - a.productCount) });
};