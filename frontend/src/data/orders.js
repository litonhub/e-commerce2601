// src/data/orders.js
//
// A few historical orders for the demo customer (user-001,
// demo@example.com) so Order History / Order Details / Track Order
// have something to show before you've placed a fresh one yourself.
// New orders placed through Checkout are added alongside these by
// src/services/orderService.js (localStorage), not by editing this file.

import products from "./products";

const findProduct = (id) => products.find((p) => p._id === id);

/** Snapshots the fields an order line item needs, the way a real backend would at purchase time. */
const lineItem = (productId, quantity) => {
  const product = findProduct(productId);
  return {
    product: product._id,
    name: product.title,
    title: product.title,
    thumbnail: product.thumbnail?.url,
    price: product.price,
    quantity,
  };
};

const buildOrder = ({ id, daysAgo, items, orderStatus, paymentMethod, paymentStatus }) => {
  const orderItems = items.map(([productId, qty]) => lineItem(productId, qty));
  const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);
  const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = subTotal >= 1000 ? 0 : 60;
  const discount = 0;
  const totalPrice = subTotal + shippingPrice - discount;

  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

  return {
    _id: id,
    userId: "user-001",
    user: { _id: "user-001", email: "demo@example.com" },
    orderItems,
    items: orderItems,
    totalItems,
    billingAddress: {
      firstName: "Liton",
      lastName: "Mia",
      email: "demo@example.com",
      phone: "01700000000",
      country: "Bangladesh",
      state: "Dhaka",
      city: "Dhaka",
      street: "House 12, Road 5, Dhanmondi",
      zipCode: "1209",
    },
    shippingAddress: {
      firstName: "Liton",
      lastName: "Mia",
      phone: "01700000000",
      country: "Bangladesh",
      state: "Dhaka",
      city: "Dhaka",
      street: "House 12, Road 5, Dhanmondi",
      zipCode: "1209",
    },
    paymentMethod,
    paymentStatus,
    orderStatus,
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
    userCurrency: "BDT",
    createdAt,
  };
};

const orders = [
  buildOrder({
    id: "order-1001",
    daysAgo: 21,
    items: [["prod-001", 2], ["prod-011", 1]],
    orderStatus: "delivered",
    paymentMethod: "cod",
    paymentStatus: "paid",
  }),
  buildOrder({
    id: "order-1002",
    daysAgo: 7,
    items: [["prod-013", 3], ["prod-024", 2]],
    orderStatus: "shipped",
    paymentMethod: "sslcommerz",
    paymentStatus: "paid",
  }),
  buildOrder({
    id: "order-1003",
    daysAgo: 2,
    items: [["prod-003", 1], ["prod-021", 2]],
    orderStatus: "processing",
    paymentMethod: "cod",
    paymentStatus: "pending",
  }),
];

export default orders;
