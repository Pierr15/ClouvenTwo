import crypto from "crypto";

export function generateSessionToken() {
  return crypto.randomUUID();
}

export function getSessionExpiry(days = 30) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}