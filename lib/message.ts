/**
 * The message length rule, shared by the form and the API route so both agree
 * on what counts as a word.
 *
 * This is the half of message checking that is openly advertised: the field
 * shows a word counter and says what it wants. The other half — deciding
 * whether the words mean anything — lives in message-quality.ts and is never
 * imported here, so it is not shipped to the browser for someone to read.
 */

export const MIN_MESSAGE_WORDS = 5

/**
 * Counts whitespace-separated runs that contain at least one letter or digit,
 * so a line of punctuation or a row of dashes is not mistaken for prose.
 * Unicode-aware, so a sender writing in any script is counted the same way.
 */
export function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length
}

export function hasEnoughWords(text: string) {
  return countWords(text) >= MIN_MESSAGE_WORDS
}
