// src/services/cartService.js
//
// Local, localStorage-backed cart. The original file already had a
// full "guest" implementation (used whenever there was no accessToken)
// alongside a real-backend implementation (used when logged in) — this
// version simply always takes that local path, since there's no
// backend to talk to and no more meaningful guest/logged-in distinction
// for cart data. Every function keeps its original name, parameters,
// and return shape, so Cart.jsx, CartSidebar, MainHeader, Shop,
// ProductDetails, and ProductQuickView all work without modification.
//
// Storage key is intentionally still "guestCart" (not renamed to just
// "cart") — a few logout handlers elsewhere already call
// localStorage.removeItem("guestCart"); keeping the name means those
// keep working untouched once Phase 3 (auth) lands.

import seedCoupons from "../data/coupons";
import { readLocal, writeLocal, simulateDelay, mockError, createLocalStore } from "../utils/mockApi";

const CART_KEY = "guestCart";
const couponStore = createLocalStore("localCoupons", seedCoupons);

const readCart = () => {
  const stored = readLocal(CART_KEY, null);
  // Defends against a leftover cart saved in the *original* app's format
  // (a plain array) under this same key, from before this conversion, or
  // any other shape that isn't a proper { items, coupon } object — in
  // either case, writes to `.items` on the wrong shape would silently
  // fail to persist (arrays don't serialize custom properties), so
  // start fresh rather than trust it.
  if (!stored || Array.isArray(stored) || !Array.isArray(stored.items)) {
    return { items: [], coupon: null };
  }
  return stored;
};
const writeCart = (cart) => writeLocal(CART_KEY, cart);

const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_SHIPPING_FEE = 60;

const lineTotal = (item) => {
  const price = item.price || 0;
  const discount = item.discountPercentage || 0;
  return (price - price * (discount / 100)) * item.quantity;
};

/** Turns the raw stored cart into the full response shape every page expects. */
const buildCartResponse = (cart) => {
  const items = cart.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + lineTotal(item), 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;

  let discount = 0;
  if (cart.coupon && subtotal >= (cart.coupon.minimumOrderAmount || 0)) {
    discount =
      cart.coupon.discountType === "percentage"
        ? (subtotal * cart.coupon.discountValue) / 100
        : cart.coupon.discountValue;
    if (cart.coupon.maximumDiscount) discount = Math.min(discount, cart.coupon.maximumDiscount);
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0, subtotal + shipping - discount);
  const couponStillValid = cart.coupon && discount > 0;

  return {
    items,
    totalItems,
    subtotal,
    shipping,
    discount,
    couponDiscount: discount,
    total,
    coupon: couponStillValid ? cart.coupon : null,
  };
};

export const addToCart = async ({ productId, quantity = 1, product }) => {
  await simulateDelay(200);

  const cart = readCart();
  const items = cart.items || [];
  const existing = items.find((item) => (item.product?._id || item.product) === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      product: product || { _id: productId },
      quantity,
      price: product?.price || 0,
      discountPercentage: product?.discountPercentage || 0,
      title: product?.title || "",
      thumbnail: product?.thumbnail?.url || product?.thumbnail || "",
    });
  }

  cart.items = items;
  writeCart(cart);
  return buildCartResponse(cart);
};

export const getCart = async () => {
  await simulateDelay();
  return buildCartResponse(readCart());
};

export const updateCartItem = async ({ productId, quantity }) => {
  await simulateDelay(200);

  const cart = readCart();
  const item = (cart.items || []).find((item) => (item.product?._id || item.product) === productId);
  if (item) {
    item.quantity = quantity;
    writeCart(cart);
  }
  return buildCartResponse(cart);
};

export const removeCartItem = async (productId) => {
  await simulateDelay(200);

  const cart = readCart();
  cart.items = (cart.items || []).filter((item) => (item.product?._id || item.product) !== productId);
  writeCart(cart);
  return buildCartResponse(cart);
};

export const applyCoupon = async (code) => {
  await simulateDelay(300);

  const normalizedCode = String(code || "").trim().toUpperCase();
  const coupon = couponStore.read().find((c) => c.code === normalizedCode && c.isActive && !c.deleted);

  if (!coupon) {
    mockError(400, "Invalid or expired coupon");
  }

  const now = new Date();
  if (coupon.startDate && now < new Date(coupon.startDate)) {
    mockError(400, "This coupon isn't active yet");
  }
  if (coupon.expireDate && now > new Date(coupon.expireDate)) {
    mockError(400, "This coupon has expired");
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    mockError(400, "This coupon has reached its usage limit");
  }

  const cart = readCart();
  const subtotal = (cart.items || []).reduce((acc, item) => acc + lineTotal(item), 0);

  if (subtotal < (coupon.minimumOrderAmount || 0)) {
    mockError(400, `Minimum purchase of \u09F3${coupon.minimumOrderAmount} required for this coupon`);
  }

  cart.coupon = coupon;
  writeCart(cart);
  return buildCartResponse(cart);
};

export const removeCoupon = async () => {
  await simulateDelay(200);

  const cart = readCart();
  cart.coupon = null;
  writeCart(cart);
  return buildCartResponse(cart);
};

export const clearCart = async () => {
  await simulateDelay(200);

  const emptyCart = { items: [], coupon: null };
  writeCart(emptyCart);
  return buildCartResponse(emptyCart);
};

// There's no backend cart to merge a "guest" cart into anymore — the
// cart is always local. Kept as a harmless no-op purely so any
// existing call site (e.g. a post-login effect) doesn't need to change.
export const syncGuestCart = async () => {
  return Promise.resolve();
};
