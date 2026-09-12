// src/data/users.js
//
// Seed accounts for the frontend-only auth system (src/services/authService.js).
// These two are the only accounts that exist "out of the box" — anyone
// can also just register a new one, or even log in directly with any
// email (see authService.js for why: there's no real backend to check
// credentials against, so login always succeeds and quietly creates an
// account on first use, exactly like the project brief asks for).
//
// Demo login you can use right away:
//   Customer -> demo@example.com  (any password)
//   Admin    -> admin@ecobazar.com (any password), sign in at /admin

const users = [
  {
    _id: "user-001",
    name: "Liton Mia",
    firstName: "Liton",
    lastName: "Mia",
    email: "demo@example.com",
    phone: "01700000000",
    avatar: null,
    role: "user",
    verified: true,
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    _id: "admin-001",
    name: "Store Admin",
    firstName: "Store",
    lastName: "Admin",
    email: "admin@ecobazar.com",
    phone: "01800000000",
    avatar: null,
    role: "admin",
    verified: true,
    createdAt: "2026-06-01T09:00:00.000Z",
  },
];

export default users;
