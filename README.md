# Haven: rent-to-rent website (demo)

A landlord-facing website for a rent-to-rent / serviced-accommodation business (working name
**"Haven"**). Its job is to reassure landlords that the company is legitimate and make it easy for
them to get in touch, with a secondary enquiry route for guests.

Built with **Next.js 16** (App Router, TypeScript) and designed to run free on **Vercel**.

> ⚠️ **Demo content.** Figures, reviews, example homes, contact details and the founder story are
> placeholders, clearly flagged on the page. Replace them before going live (see *Before launch*).

## Pages

| Route | What it's for |
| ----- | ------------- |
| `/` | Hero with a quick-appraisal card (postcode + bedrooms, carried into the contact form), key figures, who we are, "the usual way vs. with Haven" comparison, how it works timeline, benefits, reviews, FAQ preview, call to action |
| `/landlords` | The full landlord proposition: the arrangement, steps, refurbishment, benefits, full FAQ (`/landlords#faq`) |
| `/about` | Story, values, areas covered (London now, Jamaica coming soon) |
| `/stay` | Guest page: example homes and "Book on Airbnb" buttons (guests book on Airbnb, not through a form) |
| `/contact` | Landlord appraisal form, contact details, and an Airbnb button for people looking to stay |
| `/privacy` | Template GDPR privacy notice |

Also generates `sitemap.xml`, `robots.txt`, page titles/descriptions and Open Graph tags.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # spam filter + contact form tests
npm run typecheck
npm run build
```

## Change the name, details, colours or photos

- **Name, tagline, email, phone, WhatsApp, areas, Airbnb link, social links, photos:**
  everything is in [`site.config.ts`](site.config.ts). Renaming from "Haven" to anything else is a
  one-line change.
- **Colours and fonts:** the variables at the top of [`app/globals.css`](app/globals.css) (navy
  `--accent`, cream `--sand`, gold `--clay`). Fonts are set in [`app/layout.tsx`](app/layout.tsx)
  (Plus Jakarta Sans headings, Inter body).
- **FAQ:** [`content/faq.ts`](content/faq.ts).
- **Figures and reviews:** [`content/proof.ts`](content/proof.ts). Set `SHOW_PLACEHOLDER_PROOF = false`
  to hide them until real ones exist.
- **Photos:** free Unsplash stock in `public/images/` (list and sources in
  [`public/images/README.md`](public/images/README.md)). Overwrite the files with real property photos
  when available. A drawn placeholder appears for any photo set to `null`.
- **WhatsApp button:** set `contact.whatsapp` in `site.config.ts` (e.g. `"447700900123"`) and a
  floating chat button appears.

## Contact form and spam filter

Enquiries are POSTed to [`app/api/contact/route.ts`](app/api/contact/route.ts), which:

1. **Validates** every field on the server ([`lib/validate.ts`](lib/validate.ts)).
2. **Filters spam** ([`lib/spam.ts`](lib/spam.ts)):
   - a hidden **honeypot** field that only bots fill in,
   - a **minimum fill time** (forms sent in under 3 seconds are bots),
   - a **dictionary check**: each word of the message is looked up in a ~275,000-word English
     dictionary; messages that are mostly made-up "mumbo-jumbo" (or keyboard mash like `asdkjh`)
     are rejected,
   - a limit on links in the message,
   - a light per-IP **rate limit** ([`lib/rateLimit.ts`](lib/rateLimit.ts)).

   Spam is dropped **silently**: the sender still sees "thank you", so bots learn nothing.
3. **Emails** the enquiry ([`lib/email.ts`](lib/email.ts)) via [Resend](https://resend.com)'s free
   tier (100 emails a day), with "reply-to" set to the sender. If no API key is set, the enquiry is
   written to the server log instead, so the demo works with zero setup.

### Turn on email delivery

1. Create a free Resend account and an API key.
2. In Vercel → Project → Settings → Environment Variables, add (see [`.env.example`](.env.example)):
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`: the inbox enquiries go to
   - `CONTACT_FROM_EMAIL`: optional; use `onboarding@resend.dev` until the real domain is verified in Resend
3. Redeploy.

## Deploy to Vercel (free)

1. Go to <https://vercel.com/new> and import this GitHub repository.
2. Keep the defaults (framework: Next.js) and click **Deploy**.
3. You'll get a free `*.vercel.app` link to share with the client.
4. Once the business name is final, buy the domain and add it under Project → Settings → Domains,
   then set `NEXT_PUBLIC_SITE_URL` to it.

## Before launch

- [ ] Final business name in `site.config.ts` (and check the domain and Companies House availability)
- [ ] Real email, phone, company name/number, and ICO registration in the privacy notice
- [ ] Her Airbnb host profile or listing URL in `site.config.ts` → `bookingLinks.airbnb` (currently the Airbnb home page)
- [ ] Replace placeholder figures and reviews with real ones, or hide them. Publishing invented
      reviews is illegal in the UK (DMCC Act 2024)
- [ ] Founder story on `/about` in her own words
- [ ] Have the FAQ answers and privacy notice checked against the real agreement (ideally by a solicitor)
- [ ] Swap stock photos for real properties as they come on board
- [ ] Turn on email delivery (above) and send a test enquiry

## Later (not in this demo)

- Real property listings linked to their individual Airbnb pages
- Direct booking
- Smart-lock / property-automation dashboard (check which devices offer APIs)
- Moving from free tiers to paid plans for reliability once the business is trading
