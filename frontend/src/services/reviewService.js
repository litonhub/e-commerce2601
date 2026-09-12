// src/services/reviewService.js
//
// Local, localStorage-backed product reviews. There was no dedicated
// reviewApi/reviewService before — ProductDetails.jsx called
// `api.get`/`api.post` directly — so this is a new abstraction (same
// idea as authService in an earlier phase), with ProductDetails.jsx and
// ClientTestimonial.jsx updated to use it instead of raw axios calls.

import seedReviews from "../data/reviews";
import seedProducts from "../data/products";
import { simulateDelay, mockError, mockResponse, generateId, readLocal, createLocalStore } from "../utils/mockApi";

const reviewStore = createLocalStore("localReviews", seedReviews);
const productStore = createLocalStore("localProducts", seedProducts);

const getSessionUser = () => readLocal("user", null);

export const getProductReviews = async (productId, { page = 1, limit = 5 } = {}) => {
  await simulateDelay();

  const all = reviewStore
    .read()
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const start = (page - 1) * limit;
  const reviews = all.slice(start, start + limit);

  return mockResponse({
    success: true,
    data: {
      reviews,
      pagination: {
        currentPage: page,
        hasNextPage: start + limit < all.length,
        totalReviews: all.length,
      },
    },
  });
};

export const submitReview = async ({ productId, rating, comment }) => {
  await simulateDelay(400);

  const sessionUser = getSessionUser();
  if (!sessionUser) {
    mockError(401, "Please log in to write a review");
  }
  if (!rating || !comment?.trim()) {
    mockError(400, "Rating and comment are required");
  }

  const reviews = reviewStore.read();
  const newReview = {
    _id: `review-${generateId()}`,
    productId,
    user: { name: sessionUser.name, avatar: sessionUser.avatar },
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  reviewStore.write(reviews);

  // Keep the product's rating summary in sync, the way a real backend would.
  const products = productStore.read();
  const product = products.find((p) => p._id === productId);
  if (product) {
    const productReviews = reviews.filter((r) => r.productId === productId);
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    product.averageRating = Math.round(avg * 10) / 10;
    product.rating = product.averageRating;
    product.totalRatings = productReviews.length;
    productStore.write(products);
  }

  return mockResponse({ success: true, message: "Review submitted successfully.", data: newReview });
};

/**
 * Homepage testimonials. Matches the real backend's actual behavior:
 * /reviews/testimonials reused the same reviews collection, filtered
 * to the highly-rated ones, with product/user info attached.
 */
export const getTestimonials = async () => {
  await simulateDelay();

  const products = productStore.read();
  const testimonials = reviewStore
    .read()
    .filter((r) => r.rating >= 4)
    .slice(0, 8)
    .map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      user: r.user,
      product: { title: products.find((p) => p._id === r.productId)?.title || "Product" },
    }));

  return mockResponse({ success: true, data: testimonials });
};
