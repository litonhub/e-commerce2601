// src/services/paymentService.js
//
// Simulates a payment gateway redirect. Real SSLCommerz would send the
// shopper off-site and call back later; here we just mark the order
// paid immediately (reusing orderService's own update logic, so there's
// one source of truth for order data) and point the browser at our own
// success page. Checkout.jsx is unchanged — it still does
// `window.location.href = paymentRes.data.gatewayUrl`, which now just
// happens to be an internal route instead of an external one.

import { simulateDelay, mockError } from "../utils/mockApi";
import { getSingleOrder, updateOrderStatus } from "./orderService";

export const initPayment = async (orderId) => {
  await simulateDelay(500);

  try {
    await getSingleOrder(orderId); // 404s if the order doesn't exist
    await updateOrderStatus(orderId, { paymentStatus: "paid" });
  } catch {
    mockError(400, "Unable to initialize payment for this order");
  }

  return {
    success: true,
    data: { gatewayUrl: `/payment/success?order=${orderId}` },
  };
};
