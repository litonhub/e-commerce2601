# Ecobazar — Frontend Only

A modern grocery e-commerce storefront and admin dashboard, built with React, Vite, and Tailwind CSS. This is a **frontend-only** version of a full-stack project, converted so it can run and be demoed with zero backend — and so a backend can be built against it from scratch as a learning project.

**Current version:** Frontend-only
**Data:** Local dummy data + `localStorage`
**Backend:** Not included
**Database:** Not included
**Authentication:** Demo only (any email/password works)
**Payment:** Demo/simulated only

## Getting started

```bash
npm install
npm run dev
```

Then visit the printed local URL. `npm run build` produces a production build; `npm run lint` runs ESLint.

## Demo accounts

No real authentication exists — any email + non-empty password logs you in and creates an account on first use. Two accounts are pre-seeded:

| Role | Email | Password |
|---|---|---|
| Customer | `demo@example.com` | *(anything)* |
| Admin (sign in at `/admin`) | `admin@ecobazar.com` | *(anything)* |

**Demo coupon codes** (in the cart): `ECO10`, `SAVE20`, `WELCOME50`

**OTP screens** (registration / password reset): any 6-digit code works, e.g. `123456`.

## What's included

- **Storefront:** home, shop with filters/search/sort/pagination, product details with reviews, cart, wishlist, checkout, order tracking, order history, account settings, blog, FAQ, contact form, newsletter signup
- **Admin dashboard:** products (full CRUD, recycle bin, bulk CSV/Excel import, bulk image upload), categories, coupons (with recycle bin), orders, users, analytics (charts), blog CMS, settings
- **Bilingual:** English/Bangla throughout, including product, category, and blog content

## How the data layer works

Every page and component talks to a `src/services/*.js` or `src/api/*Api.js` file — never directly to a network call. Each of those files currently reads and writes local dummy data (seeded from `src/data/*.js`, persisted in `localStorage` for anything a user creates or edits) instead of calling a real backend. Because the function names, parameters, and return shapes are unchanged from what the original real-backend version used, no page or component needed backend-specific changes — only the internals of the services/api files did.

```
src/pages, src/components   →  UI, unchanged
        ↓
src/services/*.js,          →  same names/shapes as a real API client
src/api/*Api.js
        ↓
src/data/*.js  +  localStorage   →  today's "database"
```

`src/api/api.js` is the one exception worth calling out: it's a fully working axios client (auth headers, JWT refresh-retry flow) that nothing currently imports. It's kept, unmodified, specifically so reconnecting a real backend later is mostly a matter of swapping each service/api file's local-data calls back to `api.get/post/put/delete(...)`.

## Building a real backend for this later

```
Frontend (this repo)
   ↓ REST API
Node.js + Express
   ↓
MongoDB
```

A reasonable order to build it in: auth → products/categories → cart/wishlist → orders/checkout → admin CRUD → reviews/blog. Match each `src/services/*.js` or `src/api/*Api.js` file's existing function names and return shapes, and the frontend won't need any changes beyond pointing `src/api/api.js` at a real base URL.

## Known limitations

- **`xlsx` dependency:** used for admin Excel import/export. Its npm-registry build has a documented, unpatched advisory (prototype pollution / ReDoS) — low real-world risk here since it's an admin-only tool parsing files you upload yourself, but worth knowing before deploying anywhere public. Remove Excel import and keep CSV import if you'd rather not carry the dependency.
- Two admin screens are placeholders carried over from the original project, not something this conversion built out: `EditCoupon` (no edit form yet — only Add/List/Recycle Bin exist) and the dashboard's `/admin-dashboard/settings` form (already fully simulated, but doesn't persist across a refresh).
- The Shop page's category filter and tag filter are a fixed list in the UI itself; a product whose category/tags don't match that fixed list will still appear in search and "All", just not under that specific filter.

## Tech stack

React 19 · Vite · Tailwind CSS v4 · React Router v7 · TanStack Query · React Context (auth, currency) · i18next · Framer Motion · Recharts · Papaparse · SheetJS (xlsx) · Jodit React
