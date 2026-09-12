// src/services/orderService.js
//
// Local, localStorage-backed orders (seeded from src/data/orders.js on
// first use). Every exported function keeps its original name and
// parameters; return shapes match the original `{ success, data, message }`
// envelope those functions already unwrapped once, so Checkout, Track
// Order, Order History, and Order Details all work without modification.
//
// getAllOrders / updateOrderStatus / deleteOrder are admin-only and
// aren't wired to any admin screen yet (the original app didn't have
// one either) — they're ready for the admin-dashboard phase to use.

import seedOrders from "../data/orders";
import seedProducts from "../data/products";
import { clearCart } from "./cartService";
import { readLocal, writeLocal, simulateDelay, mockError, generateId, createLocalStore } from "../utils/mockApi";

const ORDERS_KEY = "localOrders";
const productStore = createLocalStore("localProducts", seedProducts);

const readOrders = () => readLocal(ORDERS_KEY, null) || seedOrders.map((o) => ({ ...o }));
const writeOrders = (orders) => writeLocal(ORDERS_KEY, orders);
const getSessionUser = () => readLocal("user", null);
const findProduct = (id) => productStore.read().find((p) => p._id === id);

export const createOrder = async (orderData) => {
  await simulateDelay(600);

  const sessionUser = getSessionUser();
  if (!sessionUser) {
    mockError(401, "Please log in to place an order");
  }

  const orderItems = (orderData.orderItems || []).map(({ product, quantity }) => {
    const p = findProduct(product);
    return {
      product,
      name: p?.title,
      title: p?.title,
      thumbnail: p?.thumbnail?.url,
      price: p?.price || 0,
      quantity,
    };
  });

  const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);
  const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = orderItems.length === 0 ? 0 : subTotal >= 1000 ? 0 : 60;
  const discount = 0;
  const totalPrice = subTotal + shippingPrice - discount;

  const newOrder = {
    _id: `order-${generateId()}`,
    userId: sessionUser._id,
    user: { _id: sessionUser._id, email: sessionUser.email },
    orderItems,
    items: orderItems,
    totalItems,
    billingAddress: orderData.billingAddress,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentMethod === "cod" ? "pending" : "unpaid",
    orderStatus: "pending",
    subTotal,
    itemsPrice: subTotal,
    shippingPrice,
    shippingCost: shippingPrice,
    discount,
    discountAmount: discount,
    totalPrice,
    totalAmount: totalPrice,
    total: totalPrice,
    grandTotal: totalPrice,
    userCurrency: orderData.userCurrency || "BDT",
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  orders.unshift(newOrder);
  writeOrders(orders);

  // Real-backend behavior being replicated here: successfully creating
  // an order empties the cart server-side. There's no server now, so
  // we clear the local cart ourselves instead.
  try {
    await clearCart();
  } catch {
    // Non-fatal — the order is already saved either way.
  }

  return { success: true, message: "Order placed successfully.", data: newOrder };
};

export const getMyOrders = async () => {
  await simulateDelay();

  const sessionUser = getSessionUser();
  const orders = sessionUser ? readOrders().filter((o) => o.userId === sessionUser._id) : [];

  return { success: true, data: { orders } };
};

export const getSingleOrder = async (id) => {
  await simulateDelay();

  const order = readOrders().find((o) => o._id === id);
  if (!order) {
    mockError(404, "Order not found");
  }

  return { success: true, data: order };
};

export const cancelOrder = async (id) => {
  await simulateDelay(300);

  const orders = readOrders();
  const order = orders.find((o) => o._id === id);
  if (!order) {
    mockError(404, "Order not found");
  }

  order.orderStatus = "cancelled";
  writeOrders(orders);

  return { success: true, message: "Order cancelled.", data: order };
};

// ---------------------------------------------------------------------
// Admin (no admin screen consumes these yet — see file header note)
// ---------------------------------------------------------------------

export const getAllOrders = async (params = {}) => {
  await simulateDelay();

  let orders = readOrders();
  if (params?.status) {
    orders = orders.filter((o) => o.orderStatus === params.status);
  }

  return { success: true, data: { orders, total: orders.length } };
};

export const updateOrderStatus = async (id, payload = {}) => {
  await simulateDelay(300);

  const orders = readOrders();
  const order = orders.find((o) => o._id === id);
  if (!order) {
    mockError(404, "Order not found");
  }

  if (payload.orderStatus) order.orderStatus = payload.orderStatus;
  if (payload.paymentStatus) order.paymentStatus = payload.paymentStatus;
  writeOrders(orders);

  return { success: true, message: "Order updated.", data: order };
};

export const deleteOrder = async (id) => {
  await simulateDelay(300);

  const orders = readOrders().filter((o) => o._id !== id);
  writeOrders(orders);

  return { success: true, message: "Order deleted." };
};
