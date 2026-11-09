/**
 * Spam filter for the contact form.
 *
 * 1. Honeypot: a hidden "company" field people never see. Bots fill it in.
 * 2. Speed: a person takes more than a few seconds to fill in the form.
 * 3. Dictionary: the message is checked word by word against an English
 *    dictionary (~275k words). Keyboard-mash like "asdkjh qwpoeiru" fails.
 * 4. Links: genuine enquiries rarely contain several URLs.
 *
 * Spam is dropped silently: the sender still sees "thanks", so bots learn nothing.
 */
import englishWords from "an-array-of-english-words";

export const MIN_FILL_MS = 3000;
/** At least this share of words must be real for a message to pass. */
export const MIN_REAL_WORD_RATIO = 0.6;
const MAX_LINKS = 2;

/** Words a landlord or guest might use that a general dictionary can miss. */
const EXTRA_WORDS = [
  "airbnb", "hmo", "hmos", "ensuite", "en-suite", "postcode", "postcodes", "lettings", "landlord",
  "landlords", "booking", "bookings", "wifi", "council", "freeholder", "leasehold", "leaseholder",
  "refurb", "refurbished", "airbnbs", "btl", "serviced", "sublet", "subletting", "rent-to-rent",
  "r2r", "ok", "okay", "thanks", "hi", "hello", "email", "emails", "online", "website", "whatsapp",
  "jamaica", "london", "uk", "kingston", "mins", "asap", "etc", "info", "flat", "flats", "studio",
  "studios", "apartment", "apartments", "tenancy", "tenancies", "voids", "corporate", "contractors",
];

let dictionary: Set<string> | null = null;
function dict(): Set<string> {
  if (!dictionary) dictionary = new Set([...(englishWords as string[]), ...EXTRA_WORDS]);
  return dictionary;
}

export function isKnownWord(word: string): boolean {
  const d = dict();
  const w = word.toLowerCase().replace(/^'+|'+$/g, "");
  if (d.has(w)) return true;
  // Simple forms the list may not hold: possessives and contractions.
  const base = w.replace(/'(s|d|ll|re|ve|m|t)$/, "").replace(/n't$/, "");
  return base !== w && d.has(base);
}

/** Five or more consonants in a row ("sdfghj") almost never happen in English. */
const CONSONANT_RUN = /[bcdfghjklmnpqrstvwxz]{5,}/;

export type GibberishScore = { words: number; known: number; ratio: number; mashed: number };

export function scoreText(text: string): GibberishScore {
  const cleaned = text
    .toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g, " ") // links
    .replace(/\S+@\S+/g, " ") // email addresses
    .replace(/[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}/g, " "); // UK postcodes like "SW1A 1AA"
  // Words of 3+ letters. Short words are too easy to match by accident, and
  // anything containing digits (house numbers, flat 4B) is ignored.
  const words = (cleaned.match(/[a-z][a-z'-]*[a-z]/g) ?? []).filter((w) => w.length >= 3);
  let known = 0;
  let mashed = 0;
  for (const w of words) {
    if (isKnownWord(w) || w.split("-").every((part) => part.length < 3 || isKnownWord(part))) known++;
    else if (CONSONANT_RUN.test(w)) mashed++;
  }
  return { words: words.length, known, ratio: words.length ? known / words.length : 1, mashed };
}

/** True when the text looks like nonsense rather than something a person wrote. */
export function isGibberish(text: string): boolean {
  const s = scoreText(text);
  if (s.words === 0) return true; // no real words at all, e.g. "!!!! 1234"
  if (s.mashed >= 2 && s.mashed / s.words >= 0.25) return true;
  // Very short messages ("Call me please") get the benefit of the doubt unless every word is unknown.
  if (s.words < 4) return s.known === 0;
  return s.ratio < MIN_REAL_WORD_RATIO;
}

export type SpamVerdict = { spam: false } | { spam: true; reason: "honeypot" | "too-fast" | "gibberish" | "links" };

export function checkSpam(input: {
  honeypot: string;
  startedAt: number | null;
  name: string;
  message: string;
  now?: number;
}): SpamVerdict {
  const now = input.now ?? Date.now();
  if (input.honeypot.trim() !== "") return { spam: true, reason: "honeypot" };
  if (input.startedAt === null || now - input.startedAt < MIN_FILL_MS) return { spam: true, reason: "too-fast" };
  const links = input.message.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (links > MAX_LINKS) return { spam: true, reason: "links" };
  if (isGibberish(input.message)) return { spam: true, reason: "gibberish" };
  return { spam: false };
}
