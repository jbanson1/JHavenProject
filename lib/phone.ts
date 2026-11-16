/**
 * Phone helpers shared by the form and the API route.
 *
 * Deliberately dependency-free. The authoritative check lives in
 * phone-server.ts, which carries libphonenumber-js and its metadata table for
 * every numbering plan in the world — far too much to ship to a visitor's
 * browser for one field. What is here is the cheap plausibility check, so the
 * form can give instant feedback and both sides agree on what is obviously
 * malformed.
 */

/** E.164 allows at most 15 digits; the shortest national numbers are 4. */
export const PHONE_DIGIT_BOUNDS = { min: 4, max: 15 }

/**
 * Strips everything a person might type around the number itself — spaces,
 * brackets, dots, dashes, and the "(0)" that appears in numbers written for
 * both domestic and international use. A leading plus is kept, because it
 * tells the parser the number already carries its own country code.
 */
export function sanitisePhoneInput(raw: string) {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

/**
 * Digit count only. Whether a number actually exists in its country's
 * numbering plan is normalisePhone's job, not this one's.
 */
export function isPlausiblePhone(raw: string) {
  const digits = sanitisePhoneInput(raw).replace(/\D/g, '').length
  return digits >= PHONE_DIGIT_BOUNDS.min && digits <= PHONE_DIGIT_BOUNDS.max
}
