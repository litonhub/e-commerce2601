// src/data/categories.js
//
// Local dummy category data. The shape mirrors exactly what
// `GET /categories` used to return from the real backend
// (see the now-frontend-only src/api/categoryApi.js), so every
// component that already consumes categories — PopularCategories,
// Shop's filter sidebar, the admin category screens — keeps working
// unchanged once a real backend is reconnected later.
//
// NOTE: `name.en` values intentionally match (case-insensitively) the
// hardcoded category list inside src/pages/Shop.jsx, since Shop.jsx
// filters products by category name rather than category id.
//
// Field name note: this is `isPopular` (not `popular`) because that's
// the field name the admin category form (AddCategory/EditCategory)
// actually reads and writes — matching it here means those forms need
// no special-casing.

import fruitIcon from "../assets/images/fruit.png";
import vegeIcon from "../assets/images/vege.png";
import cookingIcon from "../assets/images/cooking.png";
import snacksIcon from "../assets/images/snacks.png";
import beverageIcon from "../assets/images/bevarage.png";
import beautyIcon from "../assets/images/beauty.png";
import bakingIcon from "../assets/images/baking.png";

const categories = [
  {
    _id: "cat-001",
    name: { en: "Fresh Fruit", bn: "তাজা ফল" },
    slug: "fresh-fruit",
    description: "Seasonal fruit picked fresh — apples, mangoes, citrus and more.",
    image: { url: fruitIcon },
    isPopular: true,
    status: "active",
    productCount: 4,
  },
  {
    _id: "cat-002",
    name: { en: "Fresh Vegetables", bn: "তাজা সবজি" },
    slug: "fresh-vegetables",
    description: "Everyday vegetables for home cooking, sourced daily.",
    image: { url: vegeIcon },
    isPopular: true,
    status: "active",
    productCount: 6,
  },
  {
    _id: "cat-003",
    name: { en: "Cooking", bn: "রান্নার উপকরণ" },
    slug: "cooking",
    description: "Oil, rice, lentils and other kitchen staples.",
    image: { url: cookingIcon },
    isPopular: true,
    status: "active",
    productCount: 4,
  },
  {
    _id: "cat-004",
    name: { en: "Snacks", bn: "নাস্তা ও স্ন্যাকস" },
    slug: "snacks",
    description: "Chips, cookies and other everyday snacks.",
    image: { url: snacksIcon },
    isPopular: true,
    status: "active",
    productCount: 3,
  },
  {
    _id: "cat-005",
    name: { en: "Beverages", bn: "পানীয়" },
    slug: "beverages",
    description: "Water, juice and tea to keep you refreshed.",
    image: { url: beverageIcon },
    isPopular: true,
    status: "active",
    productCount: 3,
  },
  {
    _id: "cat-006",
    name: { en: "Beauty & Health", bn: "রূপচর্চা ও স্বাস্থ্য" },
    slug: "beauty-health",
    description: "Honey, skincare and wellness essentials.",
    image: { url: beautyIcon },
    isPopular: true,
    status: "active",
    productCount: 3,
  },
  {
    _id: "cat-007",
    name: { en: "Bread & Bakery", bn: "রুটি ও বেকারি" },
    slug: "bread-bakery",
    description: "Fresh-baked bread, croissants and bakery favourites.",
    image: { url: bakingIcon },
    isPopular: true,
    status: "active",
    productCount: 3,
  },
];

export default categories;
