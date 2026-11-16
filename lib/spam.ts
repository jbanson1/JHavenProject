/**
 * Spam filter for the contact form. SERVER ONLY (imports message-quality.ts,
 * whose rules must not be shipped to the browser).
 *
 * 1. Honeypot: a hidden "company" field people never see. Bots fill it in.
 * 2. Speed: a person takes more than a few seconds to fill in the form.
 * 3. Links: genuine enquiries rarely contain several URLs.
 * 4. Writing quality (from JMB Digital Forge, lib/message-quality.ts): when a
 *    message is given, it must read like real writing — not keyboard mash
 *    ("asdkjh qwpoeiru"), unpronounceable runs, or the same few words
 *    repeated. Names, brands and acronyms pass, because it checks whether
 *    words are sayable rather than looking them up in a dictionary.
 *
 * Spam is dropped silently: the sender still sees "thanks", so bots learn
 * nothing. The route logs dropped messages in full so a wrongly caught
 * enquiry can still be read from the runtime logs and answered by hand.
 */
import { countWords } from "./message";
import { looksLikeRealWriting } from "./message-quality";

export const MIN_FILL_MS = 3000;
const MAX_LINKS = 2;

export type SpamVerdict = { spam: false } | { spam: true; reason: "honeypot" | "too-fast" | "links" | "gibberish" };

export function checkSpam(input: {
  honeypot: string;
  startedAt: number | null;
  message: string;
  now?: number;
}): SpamVerdict {
  const now = input.now ?? Date.now();
  if (input.honeypot.trim() !== "") return { spam: true, reason: "honeypot" };
  if (input.startedAt === null || now - input.startedAt < MIN_FILL_MS) return { spam: true, reason: "too-fast" };
  const links = input.message.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (links > MAX_LINKS) return { spam: true, reason: "links" };
  // The message is optional here, so it is only judged when there is one.
  if (countWords(input.message) > 0 && !looksLikeRealWriting(input.message)) return { spam: true, reason: "gibberish" };
  return { spam: false };
}
