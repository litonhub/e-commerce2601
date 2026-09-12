// src/data/reviews.js
//
// Local dummy reviews, used two ways — exactly like the real backend
// did: as per-product reviews on Product Details, and (filtered to the
// high-rated ones) as homepage testimonials. There's no separate
// "testimonials" table here on purpose — /reviews/testimonials in the
// original app read from this same collection.

const reviews = [
  {
    _id: "review-001",
    productId: "prod-001",
    user: { name: "Rahim Ahmed", avatar: null },
    rating: 5,
    comment: "Very fresh and good quality apples. Will order again.",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    _id: "review-002",
    productId: "prod-001",
    user: { name: "Nusrat Jahan", avatar: null },
    rating: 4,
    comment: "Good apples, though a couple were slightly bruised on arrival.",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    _id: "review-003",
    productId: "prod-003",
    user: { name: "Kamal Hossain", avatar: null },
    rating: 5,
    comment: "Sweetest mangoes I've bought online this season. Highly recommend.",
    createdAt: "2026-08-10T10:00:00.000Z",
  },
  {
    _id: "review-004",
    productId: "prod-005",
    user: { name: "Farzana Akter", avatar: null },
    rating: 5,
    comment: "Tomatoes were fresh and lasted the whole week in the fridge.",
    createdAt: "2026-08-05T10:00:00.000Z",
  },
  {
    _id: "review-005",
    productId: "prod-011",
    user: { name: "Shahriar Kabir", avatar: null },
    rating: 5,
    comment: "Ecobazar has become my go-to for groceries. Fast delivery, fair prices.",
    createdAt: "2026-07-28T10:00:00.000Z",
  },
  {
    _id: "review-006",
    productId: "prod-011",
    user: { name: "Tania Islam", avatar: null },
    rating: 4,
    comment: "Good quality oil, packaging could be sturdier for shipping.",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    _id: "review-007",
    productId: "prod-013",
    user: { name: "Imran Chowdhury", avatar: null },
    rating: 5,
    comment: "Rice quality is excellent, exactly as described. Cooks up light and fluffy.",
    createdAt: "2026-07-15T10:00:00.000Z",
  },
  {
    _id: "review-008",
    productId: "prod-021",
    user: { name: "Sadia Rahman", avatar: null },
    rating: 5,
    comment: "The honey tastes completely natural, not overly sweet like some brands.",
    createdAt: "2026-07-10T10:00:00.000Z",
  },
  {
    _id: "review-009",
    productId: "prod-024",
    user: { name: "Arif Hasan", avatar: null },
    rating: 4,
    comment: "Bread was soft and fresh, delivered right on time.",
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    _id: "review-010",
    productId: "prod-016",
    user: { name: "Mahin Sarker", avatar: null },
    rating: 5,
    comment: "My kids love these cookies, and the discount made it an easy buy.",
    createdAt: "2026-06-30T10:00:00.000Z",
  },
];

export default reviews;
