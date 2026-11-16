/**
 * Whether a message says anything, as opposed to merely being long enough.
 *
 * SERVER ONLY. This must never be imported by a client component. A sender
 * who can read these rules in the page bundle can write around them in a
 * minute, and the route deliberately gives no sign when a message trips them,
 * so the rules themselves are the only thing keeping it useful.
 */

import { MIN_MESSAGE_WORDS } from './message'

/**
 * Catching "asdkjh askdjh askdjh" without a dictionary.
 *
 * A dictionary is the obvious tool and the wrong one: a real enquiry is full
 * of words no word list holds — WooCommerce, Xero, Kubernetes, the sender's
 * own surname, their company. Checking instead whether a word is *sayable*
 * passes all of those and still fails a fistful of keys.
 *
 * Every threshold below is set to let doubtful cases through. Wrongly
 * rejecting one real enquiry costs more than a hundred junk ones landing in
 * an inbox, so nothing here fires on a single odd word.
 */

/** Below this, a word carries too little signal to judge: "SEO", "a", "k8s". */
const MIN_JUDGEABLE_LENGTH = 4

/** English tolerates long clusters — "strengths" runs to five. Six does not happen. */
const MAX_CONSONANT_RUN = 6

/** Four keys in a row on one rank of the keyboard: asdf, qwer, hjkl. */
const KEYBOARD_RUN = 4

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

/**
 * Consonant pairs English does not put next to each other. Pairs that look
 * unlikely but do occur are deliberately absent: "xc" is in excite, "bv" in
 * subvert, "lk" in milk, "mn" in column, "sq" in squash, "ql" in PostgreSQL.
 * What is left is the shape of a hand crossing the keyboard.
 */
const IMPLAUSIBLE_PAIRS =
  /jh|jk|kj|jq|qj|jz|zj|jx|xj|jv|vj|qw|wq|qz|zq|qx|xq|zx|xz|kq|qk|kz|zk|vq|qv|fq|qf|gq|qg|hq|qh|pq|qp|mq|qm|nq|qn|bq|qb|dq|qd/

/** English words do not end in j or q. */
const IMPLAUSIBLE_ENDINGS = /[jq]$/

/**
 * Both rules must hold before a message is refused, so a message with one or
 * two unusual names in it is never at risk — only one largely made of junk.
 */
const GIBBERISH_MIN_WORDS = 3
const GIBBERISH_MIN_SHARE = 0.5

/**
 * The other half of the problem: mashing that happens to alternate vowels and
 * consonants plausibly — "asdkjh askdjh askjdh" — reads as sayable and slips
 * every test above. What gives it away is not the words but the repetition:
 * it is three tokens typed ten times. Prose does not do that, and this also
 * catches "test test test test …", which is made of real words and is just as
 * worthless.
 */
const MIN_DISTINCT_SHARE = 0.4

function stripOuterPunctuation(token: string) {
  return token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
}

/**
 * Only plain Latin-script words of a useful length are judged at all.
 *
 * Anything with a digit is skipped (part numbers, "24/7", a URL), as is
 * anything outside A-Z, which leaves every non-Latin script alone rather than
 * calling it unpronounceable. ALL-CAPS tokens are read as acronyms, which is
 * what rescues HTML, SMTP and HTTPS from the vowel rule below.
 */
function isJudgeable(token: string) {
  if (token.length < MIN_JUDGEABLE_LENGTH) return false
  if (!/^[A-Za-z]+$/.test(token)) return false
  if (token === token.toUpperCase()) return false
  return true
}

function hasKeyboardRun(word: string) {
  for (let i = 0; i + KEYBOARD_RUN <= word.length; i++) {
    const slice = word.slice(i, i + KEYBOARD_RUN)
    for (const row of KEYBOARD_ROWS) {
      if (row.includes(slice)) return true
      if ([...row].reverse().join('').includes(slice)) return true
    }
  }
  return false
}

function looksUnsayable(token: string) {
  const word = token.toLowerCase()

  // "aaaargh" is fine; "aaaaaaaa" is a stuck key.
  if (/(.)\1{3,}/.test(word)) return true

  // No vowel at all, counting y: "zxcvbn", "sdfgh". "rhythm" survives on its y.
  if (!/[aeiouy]/.test(word)) return true

  if (new RegExp(`[bcdfghjklmnpqrstvwxz]{${MAX_CONSONANT_RUN},}`).test(word)) return true

  if (hasKeyboardRun(word)) return true

  if (IMPLAUSIBLE_PAIRS.test(word)) return true

  if (IMPLAUSIBLE_ENDINGS.test(word)) return true

  // Almost all vowels is the same tell from the other side.
  const vowels = word.match(/[aeiouy]/g)?.length ?? 0
  if (vowels / word.length > 0.85) return true

  return false
}

export type GibberishReport = {
  /** Words the check was able to form an opinion about. */
  judged: number
  unsayable: number
  /** Share of the whole message that is distinct words. */
  distinctShare: number
  mostlyUnsayable: boolean
  tooRepetitive: boolean
  isMostlyGibberish: boolean
}

export function inspectForGibberish(text: string): GibberishReport {
  const words = text
    .trim()
    .split(/\s+/)
    .map(stripOuterPunctuation)
    .filter((token) => /[\p{L}\p{N}]/u.test(token))

  const judgeable = words.filter(isJudgeable)
  const unsayable = judgeable.filter(looksUnsayable).length

  const distinct = new Set(words.map((w) => w.toLowerCase())).size
  const distinctShare = words.length > 0 ? distinct / words.length : 1

  const mostlyUnsayable =
    unsayable >= GIBBERISH_MIN_WORDS &&
    judgeable.length > 0 &&
    unsayable / judgeable.length >= GIBBERISH_MIN_SHARE

  // Only meaningful once there are enough words to see a pattern; a short
  // message is already refused by the word count.
  const tooRepetitive =
    words.length >= MIN_MESSAGE_WORDS && distinctShare < MIN_DISTINCT_SHARE

  return {
    judged: judgeable.length,
    unsayable,
    distinctShare,
    mostlyUnsayable,
    tooRepetitive,
    isMostlyGibberish: mostlyUnsayable || tooRepetitive,
  }
}

export function looksLikeRealWriting(text: string) {
  return !inspectForGibberish(text).isMostlyGibberish
}
