// src/services/authService.js
//
// Frontend-only auth. There's no backend to check credentials against,
// so — per the project brief — login always "succeeds": any well-formed
// email + non-empty password logs you in. Two emails are special-cased
// (see src/data/users.js) so there's a stable demo customer and demo
// admin account; any other email quietly creates a fresh account on
// first login, the same way a real backend session would feel from the
// outside.
//
// Every exported function returns the same `{ data: {...} }` shape the
// real axios calls used to return, so Login/Register/Forget/Reset/
// Verify/VerifyEmail/AdminLogin/Settings only needed their `api.post(...)`
// / `api.put(...)` call swapped for the matching function here — the
// rest of each component (destructuring `response.data.message`, error
// toasts, navigation) is untouched.

import seedUsers from "../data/users";
import { simulateDelay, mockResponse, mockError, generateId, readLocal, writeLocal } from "../utils/mockApi";

const USERS_DB_KEY = "localUsersDb";
const SESSION_TOKEN_KEY = "accessToken";
const SESSION_USER_KEY = "user";

const readUsers = () => readLocal(USERS_DB_KEY, null) || seedUsers.map((u) => ({ ...u }));
const writeUsers = (users) => writeLocal(USERS_DB_KEY, users);

const splitName = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
};

const joinName = (firstName = "", lastName = "") => `${firstName} ${lastName}`.trim();

const generateToken = () => `demo-token-${generateId()}`;

/** Strips internal-only fields before handing a user record back to the UI. */
const publicUser = (user) => {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
};

const findByEmail = (users, email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase());

// ---------------------------------------------------------------------
// Session (login / register / logout)
// ---------------------------------------------------------------------

// `rememberMe` isn't destructured here — this demo always persists the
// session the same way, but callers can keep passing it unchanged.
export const login = async ({ email, password }) => {
  await simulateDelay(400);

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password) {
    mockError(400, "Email and password are required");
  }

  const users = readUsers();
  let user = findByEmail(users, normalizedEmail);

  if (!user) {
    // No real backend to reject an "unknown" login — create the account
    // on the spot, the same way the UI already expects a successful
    // login to feel. Demo emails (see src/data/users.js) already exist,
    // so this path only fires for genuinely new emails.
    const { firstName, lastName } = splitName(normalizedEmail.split("@")[0]);
    user = {
      _id: `user-${generateId()}`,
      name: joinName(firstName || "Ecobazar", lastName || "Customer"),
      firstName: firstName || "Ecobazar",
      lastName: lastName || "Customer",
      email: normalizedEmail,
      phone: "",
      avatar: null,
      role: "user",
      verified: true,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
  }

  const accessToken = generateToken();

  return mockResponse({
    success: true,
    message: `Welcome back, ${user.name.split(" ")[0]}!`,
    data: { accessToken, user: publicUser(user) },
  });
};

export const register = async ({ name, email, password, confirmPassword }) => {
  await simulateDelay(400);

  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (password !== confirmPassword) {
    mockError(400, "Passwords do not match");
  }

  const users = readUsers();
  if (findByEmail(users, normalizedEmail)) {
    mockError(409, "An account with this email already exists");
  }

  const { firstName, lastName } = splitName(name);
  const newUser = {
    _id: `user-${generateId()}`,
    name: name.trim(),
    firstName,
    lastName,
    email: normalizedEmail,
    phone: "",
    avatar: null,
    role: "user",
    verified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);

  return mockResponse({
    success: true,
    message: "Account created! Demo mode: enter any 6-digit code (e.g. 123456) to verify.",
  });
};

export const logout = async () => {
  await simulateDelay(150);
  return mockResponse({ success: true, message: "Logged out" });
};

// Not consumed by any admin screen yet (no Users page exists in the
// original app) — ready for one, and used by the dashboard overview's
// "registered users" count in the meantime.
export const getAllUsers = async () => {
  await simulateDelay();
  return readUsers().map(publicUser);
};

export const getMe = async () => {
  await simulateDelay();

  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  const sessionUser = readLocal(SESSION_USER_KEY, null);

  if (!token || !sessionUser) {
    mockError(401, "Not authenticated");
  }

  // Re-read from the users db so any profile edits (Settings) are reflected.
  const users = readUsers();
  const freshUser = findByEmail(users, sessionUser.email) || sessionUser;

  return mockResponse({ success: true, data: publicUser(freshUser) });
};

// ---------------------------------------------------------------------
// Email verification (registration OTP)
// ---------------------------------------------------------------------

export const verifyEmail = async ({ email, otp }) => {
  await simulateDelay(400);

  if (!/^\d{6}$/.test(String(otp || "").trim())) {
    mockError(400, "Please enter a valid 6-digit OTP");
  }

  const users = readUsers();
  const user = findByEmail(users, email);
  if (user) {
    user.verified = true;
    writeUsers(users);
  }

  return mockResponse({ success: true, message: "Email verified successfully. You can now log in." });
};

export const resendEmailVerification = async () => {
  await simulateDelay(300);
  return mockResponse({ success: true, message: "Demo mode: use any 6-digit code, e.g. 123456." });
};

// ---------------------------------------------------------------------
// Forgot / reset password
// ---------------------------------------------------------------------

export const forgotPassword = async () => {
  await simulateDelay(400);
  return mockResponse({
    success: true,
    message: "Demo mode: use any 6-digit code, e.g. 123456, to reset your password.",
  });
};

export const resendResetOtp = async () => {
  await simulateDelay(300);
  return mockResponse({ success: true, message: "Demo mode: use any 6-digit code, e.g. 123456." });
};

export const verifyResetOtp = async ({ otp }) => {
  await simulateDelay(300);

  if (!/^\d{6}$/.test(String(otp || "").trim())) {
    mockError(400, "Please enter a valid 6-digit OTP");
  }

  return mockResponse({ success: true, message: "OTP verified." });
};

export const resetPassword = async () => {
  await simulateDelay(400);
  return mockResponse({ success: true, message: "Password reset successfully. Please log in." });
};

// ---------------------------------------------------------------------
// Profile (Settings page)
// ---------------------------------------------------------------------

export const updateProfile = async (profileData) => {
  await simulateDelay(400);

  const sessionUser = readLocal(SESSION_USER_KEY, null);
  if (!sessionUser) mockError(401, "Not authenticated");

  const users = readUsers();
  const user = findByEmail(users, sessionUser.email);
  if (!user) mockError(404, "User not found");

  if (profileData.firstName !== undefined) user.firstName = profileData.firstName;
  if (profileData.lastName !== undefined) user.lastName = profileData.lastName;
  if (profileData.phone !== undefined) user.phone = profileData.phone;
  user.name = joinName(user.firstName, user.lastName) || user.name;

  writeUsers(users);
  writeLocal(SESSION_USER_KEY, publicUser(user));

  return mockResponse({ success: true, message: "Profile updated successfully.", data: publicUser(user) });
};

export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  await simulateDelay(400);

  if (!currentPassword || !newPassword || !confirmPassword) {
    mockError(400, "All fields are required");
  }
  if (newPassword !== confirmPassword) {
    mockError(400, "Passwords do not match");
  }

  // No real password is stored anywhere in this frontend-only build, so
  // there's nothing to check currentPassword against — we just simulate
  // success, matching "no real authentication" from the project brief.
  return mockResponse({ success: true, message: "Password changed successfully. Please log in again." });
};

/** Reads a File as a data URL (base64), used for the avatar upload below. */
const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const updateAvatar = async (file) => {
  await simulateDelay(500);

  const sessionUser = readLocal(SESSION_USER_KEY, null);
  if (!sessionUser) mockError(401, "Not authenticated");

  const dataUrl = await fileToDataUrl(file);

  const users = readUsers();
  const user = findByEmail(users, sessionUser.email);
  if (user) {
    user.avatar = dataUrl;
    writeUsers(users);
    writeLocal(SESSION_USER_KEY, publicUser(user));
  }

  return mockResponse({ success: true, message: "Profile photo updated." });
};
