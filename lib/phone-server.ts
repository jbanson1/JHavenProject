import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js'
import { findCountry } from './countries'
import { isPlausiblePhone, sanitisePhoneInput } from './phone'

/**
 * The authoritative phone check. Server-only: it pulls in libphonenumber-js,
 * which the browser has no business downloading for a single form field.
 *
 * Whatever the form believes about a number is irrelevant here — the request
 * can be made by anything, so the number is re-derived from the raw input and
 * the selected country on every submission.
 */

export type PhoneResult =
  | { ok: true; e164: string; display: string }
  | { ok: false; reason: 'country' | 'format' }

/**
 * Normalises a submitted number to E.164.
 *
 * The country comes from the form's selector rather than a guess, which is
 * what makes "07911 123456" resolve correctly: the parser knows to drop the
 * UK trunk zero and prepend +44. A number typed with its own leading + is
 * parsed as international and the selector is ignored, which is what someone
 * who typed it meant.
 *
 * Both returned strings are built by the parser from the digits it
 * recognised, never by concatenating what was typed, so neither can carry
 * anything the sender put around the number.
 */
export function normalisePhone(raw: string, countryIso: string): PhoneResult {
  if (!findCountry(countryIso)) return { ok: false, reason: 'country' }

  const cleaned = sanitisePhoneInput(raw)
  if (!isPlausiblePhone(cleaned)) return { ok: false, reason: 'format' }

  const parsed = parsePhoneNumberFromString(cleaned, countryIso as CountryCode)

  // isValid() checks the number against the country's numbering plan, not
  // just its length, so invented numbers of the right size are rejected.
  if (!parsed || !parsed.isValid()) return { ok: false, reason: 'format' }

  return {
    ok: true,
    e164: parsed.number,
    display: parsed.formatInternational(),
  }
}
