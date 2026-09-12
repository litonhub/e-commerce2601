// src/data/coupons.js
//
// Local dummy coupon data, shared by the cart's apply-coupon flow
// (src/services/cartService.js) and the admin coupon screens
// (src/services/couponService.js). Field names match what the real
// admin coupon form (CouponForm.jsx) actually reads and writes —
// discountType/discountValue/minimumOrderAmount/etc — rather than the
// simpler names used in an earlier pass, so both sides agree on one
// schema.
//
// Demo codes you can type into the cart's coupon box: ECO10, SAVE20,
// WELCOME50 — frontend-only demo coupons, not real discounts.

const coupons = [
  {
    _id: "coupon-001",
    code: "ECO10",
    name: "Eco Saver 10%",
    discountType: "percentage", // "percentage" | "fixed"
    discountValue: 10,
    minimumOrderAmount: 500,
    maximumDiscount: 0, // 0 = no cap
    usageLimit: 0, // 0 = unlimited
    usagePerUser: 1,
    usedCount: 18,
    startDate: "2026-06-01T00:00:00.000Z",
    expireDate: "2026-12-31T23:59:59.000Z",
    applicableProducts: [],
    excludedProducts: [],
    isActive: true,
    deleted: false,
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    _id: "coupon-002",
    code: "SAVE20",
    name: "Big Save 20%",
    discountType: "percentage",
    discountValue: 20,
    minimumOrderAmount: 1000,
    maximumDiscount: 300,
    usageLimit: 500,
    usagePerUser: 1,
    usedCount: 142,
    startDate: "2026-06-15T00:00:00.000Z",
    expireDate: "2026-10-31T23:59:59.000Z",
    applicableProducts: [],
    excludedProducts: [],
    isActive: true,
    deleted: false,
    createdAt: "2026-06-15T09:00:00.000Z",
  },
  {
    _id: "coupon-003",
    code: "WELCOME50",
    name: "Welcome ৳50 Off",
    discountType: "fixed",
    discountValue: 50,
    minimumOrderAmount: 300,
    maximumDiscount: 0,
    usageLimit: 0,
    usagePerUser: 1,
    usedCount: 76,
    startDate: "2026-07-01T00:00:00.000Z",
    expireDate: "2027-01-31T23:59:59.000Z",
    applicableProducts: [],
    excludedProducts: [],
    isActive: true,
    deleted: false,
    createdAt: "2026-07-01T09:00:00.000Z",
  },
];

export default coupons;
