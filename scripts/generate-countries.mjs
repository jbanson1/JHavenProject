/**
 * Regenerates lib/countries.ts from libphonenumber-js's own metadata.
 *
 * The dialling codes must agree with the library that validates against them,
 * so they are read from it rather than typed out. Country names come from
 * Intl.DisplayNames, which needs a full-ICU Node build (the default since
 * Node 14).
 *
 *   npm run gen:countries
 */
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { writeFileSync } from 'node:fs'

const names = new Intl.DisplayNames(['en-GB'], { type: 'region' })

const rows = getCountries()
  .map((iso) => ({ iso, name: names.of(iso) || iso, dial: getCountryCallingCode(iso) }))
  // Drop any code Intl has no name for: an unlabelled option is unusable.
  .filter((r) => r.name !== r.iso)
  .sort((a, b) => a.name.localeCompare(b.name, 'en'))

const body = rows
  .map((r) => `  { iso: '${r.iso}', name: ${JSON.stringify(r.name)}, dial: '${r.dial}' },`)
  .join('\n')

writeFileSync(
  'lib/countries.ts',
  `/**
 * Dialling codes for the contact form's country selector.
 *
 * GENERATED — do not hand-edit. The codes come straight from
 * libphonenumber-js's metadata and the names from Intl.DisplayNames, so the
 * list cannot drift from the library that validates against it. Regenerate
 * with: npm run gen:countries
 */

export type Country = {
  /** ISO 3166-1 alpha-2, the code libphonenumber-js parses against. */
  iso: string
  name: string
  /** Dialling code without the leading plus. */
  dial: string
}

/** Pre-selected in the form: the great majority of enquiries are UK. */
export const DEFAULT_COUNTRY = 'GB'

export const COUNTRIES: Country[] = [
${body}
]

const BY_ISO = new Map(COUNTRIES.map((c) => [c.iso, c]))

export function findCountry(iso: string) {
  return BY_ISO.get(iso)
}
`
)

console.log(`lib/countries.ts: ${rows.length} countries`)
