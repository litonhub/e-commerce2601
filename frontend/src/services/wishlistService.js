// src/services/wishlistService.js
//
// Local, localStorage-backed wishlist, same approach as cartService.js.
// Storage key stays "guestWishlist" for the same reason (existing
// logout handlers already clear it by that name). Function names and
// return shapes are unchanged, so Wishlist.jsx, MainHeader, Shop,
// ProductDetails, and ProductQuickView all work without modification.

import { readLocal, writeLocal, simulateDelay } from "../utils/mockApi";

const WISHLIST_KEY = "guestWishlist";

const readWishlist = () => readLocal(WISHLIST_KEY, []);
const writeWishlist = (list) => writeLocal(WISHLIST_KEY, list);

/** Adds a derived, always-up-to-date stock label without duplicating `stock` itself. */
const withAvailability = (product) => {
  if (!product || typeof product !== "object") return product;
  return {
    ...product,
    availabilityStatus: (product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock",
  };
};

const buildWishlistResponse = (items) => ({
  data: { items, totalItems: items.length },
});

export const getWishlist = async () => {
  await simulateDelay();
  return buildWishlistResponse(readWishlist());
};

export const addToWishlist = async ({ productId, product }) => {
  await simulateDelay(200);

  const wishlist = readWishlist();
  const existing = wishlist.find((item) => (item.product?._id || item.product) === productId);

  if (!existing) {
    wishlist.push({
      product: withAvailability(product) || { _id: productId },
      price: product?.price || 0,
      discountPercentage: product?.discountPercentage || 0,
      title: product?.title || "",
      thumbnail: product?.thumbnail?.url || product?.thumbnail || "",
    });
    writeWishlist(wishlist);
  }

  return buildWishlistResponse(wishlist);
};

export const removeFromWishlist = async (productId) => {
  await simulateDelay(200);

  let wishlist = readWishlist();
  wishlist = wishlist.filter((item) => (item.product?._id || item.product) !== productId);
  writeWishlist(wishlist);
  return buildWishlistResponse(wishlist);
};

export const clearWishlist = async () => {
  await simulateDelay(200);
  writeWishlist([]);
  return buildWishlistResponse([]);
};

// No backend wishlist to merge a "guest" wishlist into anymore.
// Kept as a harmless no-op so existing call sites don't need to change.
export const syncGuestWishlist = async () => {
  return Promise.resolve();
};
