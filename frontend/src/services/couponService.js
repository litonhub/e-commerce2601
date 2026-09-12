// src/services/couponService.js
//
// Local, localStorage-backed coupon management (shares its data with
// the cart's apply-coupon flow via src/data/coupons.js). Every
// function keeps its original name and already-unwrapped return shape
// (a plain array/object, not an axios envelope), so CouponTable,
// CouponForm, CouponRecycleBin, and every useXCoupon hook work without
// modification.

import seedCoupons from "../data/coupons";
import { simulateDelay, mockError, generateId, createLocalStore } from "../utils/mockApi";

const couponStore = createLocalStore("localCoupons", seedCoupons);

export const getCoupons = async (params = {}) => {
  await simulateDelay();

  const wantDeleted = params?.deleted === true || params?.deleted === "true";
  let result = couponStore.read().filter((c) => Boolean(c.deleted) === wantDeleted);

  if (params?.q) {
    const q = String(params.q).toLowerCase();
    result = result.filter(
      (c) => c.code.toLowerCase().includes(q) || (c.name || "").toLowerCase().includes(q)
    );
  }

  if (params?.status) {
    const wantActive = params.status === "active";
    result = result.filter((c) => c.isActive === wantActive);
  }

  if (params?.discountType) {
    result = result.filter((c) => c.discountType === params.discountType);
  }

  return result;
};

export const getCoupon = async (id) => {
  await simulateDelay();

  const coupon = couponStore.read().find((c) => c._id === id);
  if (!coupon) mockError(404, "Coupon not found");

  return coupon;
};

export const createCoupon = async (payload) => {
  await simulateDelay(400);

  const coupons = couponStore.read();

  if (coupons.some((c) => c.code.toUpperCase() === String(payload.code || "").toUpperCase() && !c.deleted)) {
    mockError(409, "A coupon with this code already exists");
  }

  const newCoupon = {
    _id: `coupon-${generateId()}`,
    code: String(payload.code || "").toUpperCase(),
    name: payload.name || "",
    discountType: payload.discountType || "percentage",
    discountValue: Number(payload.discountValue) || 0,
    minimumOrderAmount: Number(payload.minimumOrderAmount) || 0,
    maximumDiscount: Number(payload.maximumDiscount) || 0,
    usageLimit: Number(payload.usageLimit) || 0,
    usagePerUser: Number(payload.usagePerUser) || 1,
    usedCount: 0,
    startDate: payload.startDate || null,
    expireDate: payload.expireDate || null,
    applicableProducts: payload.applicableProducts || [],
    excludedProducts: payload.excludedProducts || [],
    isActive: payload.isActive ?? true,
    deleted: false,
    createdAt: new Date().toISOString(),
  };

  coupons.push(newCoupon);
  couponStore.write(coupons);

  return newCoupon;
};

export const updateCoupon = async ({ id, payload }) => {
  await simulateDelay(400);

  const coupons = couponStore.read();
  const coupon = coupons.find((c) => c._id === id);
  if (!coupon) mockError(404, "Coupon not found");

  Object.assign(coupon, {
    ...payload,
    code: payload.code ? String(payload.code).toUpperCase() : coupon.code,
  });
  couponStore.write(coupons);

  return coupon;
};

export const deleteCoupon = async (id) => {
  await simulateDelay(300);

  const coupons = couponStore.read();
  const coupon = coupons.find((c) => c._id === id);
  if (!coupon) mockError(404, "Coupon not found");

  coupon.deleted = true;
  coupon.deletedAt = new Date().toISOString();
  couponStore.write(coupons);

  return { success: true, message: "Coupon moved to recycle bin." };
};

export const restoreCoupon = async (id) => {
  await simulateDelay(300);

  const coupons = couponStore.read();
  const coupon = coupons.find((c) => c._id === id);
  if (!coupon) mockError(404, "Coupon not found");

  coupon.deleted = false;
  delete coupon.deletedAt;
  couponStore.write(coupons);

  return { success: true, message: "Coupon restored." };
};

export const toggleCouponStatus = async (id) => {
  await simulateDelay(300);

  const coupons = couponStore.read();
  const coupon = coupons.find((c) => c._id === id);
  if (!coupon) mockError(404, "Coupon not found");

  coupon.isActive = !coupon.isActive;
  couponStore.write(coupons);

  return { success: true, message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}.`, data: coupon };
};

export const permanentDeleteCoupon = async (id) => {
  await simulateDelay(300);

  const coupons = couponStore.read().filter((c) => c._id !== id);
  couponStore.write(coupons);

  return { success: true, message: "Coupon permanently deleted." };
};
