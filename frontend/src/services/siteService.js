// src/services/siteService.js
//
// New abstraction for two small storefront forms that previously called
// `api.post` directly: newsletter signup (NewsletterModal, FooterNewsletter)
// and the contact form (Contact.jsx). Submissions are stored locally —
// there's no admin inbox to view them in (the original app didn't have
// one either), but they're saved rather than silently discarded, ready
// for a real backend to pick up later.

import { simulateDelay, mockError, mockResponse, generateId, readLocal, writeLocal } from "../utils/mockApi";

const SUBSCRIBERS_KEY = "localNewsletterSubscribers";
const MESSAGES_KEY = "localContactMessages";

export const subscribeNewsletter = async (email) => {
  await simulateDelay(400);

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    mockError(400, "Please enter a valid email address");
  }

  const subscribers = readLocal(SUBSCRIBERS_KEY, []);
  if (subscribers.some((s) => s.email === normalizedEmail)) {
    return { message: "You're already subscribed!" };
  }

  subscribers.push({ email: normalizedEmail, subscribedAt: new Date().toISOString() });
  writeLocal(SUBSCRIBERS_KEY, subscribers);

  return { message: "Subscribed successfully!" };
};

export const submitContactMessage = async (data) => {
  await simulateDelay(500);

  if (!data.name || !data.email || !data.subject) {
    mockError(400, "Please fill in all required fields.");
  }

  const messages = readLocal(MESSAGES_KEY, []);
  messages.push({ _id: `msg-${generateId()}`, ...data, createdAt: new Date().toISOString() });
  writeLocal(MESSAGES_KEY, messages);

  return mockResponse({ message: "Message sent successfully!" });
};
