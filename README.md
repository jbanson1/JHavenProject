# Inhavenest: rent-to-rent website

A landlord-facing website for **Inhavenest**, a rent-to-rent / serviced-accommodation business. Its job is to reassure landlords that the company is legitimate and make it easy for
them to get in touch, with a secondary enquiry route for guests.

Built with **Next.js 16** (App Router, TypeScript) and designed to run free on **Vercel**.

> **Still to come from the client:** company number, registered office address,
> real property photos and the founder story (see *Before launch*). There are no invented figures or
> reviews on the site.

## Pages

| Route | What it's for |
| ----- | ------------- |
| `/` | Hero with a quick-appraisal card (postcode + bedrooms, carried into the contact form), key points (fixed-term agreements, rent on the same date, free appraisal, no fees), who we are, "a normal let vs. letting to Inhavenest" comparison, how it works, benefits, FAQ preview, call to action |
| `/landlords` | The full landlord proposition: the arrangement, steps, refurbishment, benefits, full FAQ (`/landlords#faq`) |
| `/about` | Story, values, areas covered (London now, Jamaica coming soon) |
| `/stay` | Guest page: what every home includes, and "coming soon" with the email address until an Airbnb listing exists (then "Book on Airbnb" buttons appear) |
| `/contact` | Landlord appraisal form (required: name, email, property type, bedrooms) and contact details. No phone number: enquiries go through the form |
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
  everything is in [`site.config.ts`](site.config.ts). The business name (`name`) is a one-line
  change.
- **Colours and fonts:** the variables at the top of [`app/globals.css`](app/globals.css) (navy
  `--accent`, cream `--sand`, gold `--clay`). Fonts are set in [`app/layout.tsx`](app/layout.tsx)
  (Plus Jakarta Sans headings, Inter body).
- **FAQ:** [`content/faq.ts`](content/faq.ts).
- **Key points strip:** [`content/keyPoints.ts`](content/keyPoints.ts). Keep these to true statements;
  add real figures and landlord reviews once there's a track record.
- **Photos:** free Unsplash stock in `public/images/` (list and sources in
  [`public/images/README.md`](public/images/README.md)). Overwrite the files with real property photos
  when available. A drawn placeholder appears for any photo set to `null`.
- **WhatsApp button:** set `contact.whatsapp` in `site.config.ts` (e.g. `"447700900123"`) and a
  floating chat button appears.

## Contact form and spam filter

Enquiries are POSTed to [`app/api/contact/route.ts`](app/api/contact/route.ts), which:

1. **Validates** every field on the server ([`lib/validate.ts`](lib/validate.ts)).
2. **Validates like the JMB Digital Forge form**: stricter email format plus a check that the
   domain can receive mail (fails open on DNS trouble), optional phone checked against the chosen
   country with libphonenumber, hard length caps, 3 submissions per 10 minutes per IP.
3. **Filters spam** ([`lib/spam.ts`](lib/spam.ts)):
   - a hidden **honeypot** field that only bots fill in,
   - a **minimum fill time** (forms sent in under 3 seconds are bots),
   - a **writing check** (from JMB Digital Forge, [`lib/message-quality.ts`](lib/message-quality.ts)):
     keyboard mash, unpronounceable runs and repeated filler are rejected, while names, brands and
     acronyms pass,
   - a limit on links in the message,
   - a light per-IP **rate limit** ([`lib/rate-limit.ts`](lib/rate-limit.ts)).

   Spam is dropped **silently**: the sender still sees "thank you", so bots learn nothing.
4. **Emails** the enquiry ([`lib/email.ts`](lib/email.ts)) to **info@inhavenest.com** (`site.contact.email`)
   via [Resend](https://resend.com)'s free tier (100 emails a day), with "reply-to" set to the
   sender. If no API key is set, the enquiry is written to the server log instead. If sending fails,
   the visitor is asked to email instead and the enquiry is still written to the log.
5. **Thanks the landlord** by email ("we'll be in contact within one working day"), with reply-to
   info@inhavenest.com. This only sends once the sender (`contact.emailFrom`) is on a domain
   verified in Resend; Resend's shared test sender can't email visitors.

### Turn on email delivery

The recipient (info@inhavenest.com) and sender are set in `site.config.ts`, so only the API key
needs adding in Vercel.

1. Create a free Resend account, ideally signed up **with info@inhavenest.com**. Until a domain is
   verified, Resend's shared sender (`onboarding@resend.dev`) only delivers to the account's own email.
2. Resend → API Keys → create a key with sending access.
3. Vercel → Project → Settings → Environment Variables → add `RESEND_API_KEY` (Production, marked
   Sensitive), then redeploy.
4. Send a test enquiry through the live form.
5. `inhavenest.com` is verified in Resend, and emails are sent from `Inhavenest <info@inhavenest.com>`
   (`contact.emailFrom` in `site.config.ts`). The sender must stay on a verified domain.

## Deploy to Vercel (free)

1. Go to <https://vercel.com/new> and import this GitHub repository.
2. Keep the defaults (framework: Next.js) and click **Deploy**.
3. You'll get a free `*.vercel.app` link to share with the client.
4. Once the business name is final, buy the domain and add it under Project → Settings → Domains,
   then set `NEXT_PUBLIC_SITE_URL` to it.

## Before launch

- [ ] Final business name in `site.config.ts` (and check the domain and Companies House availability)
- [x] Contact email set to info@inhavenest.com (no phone number, by choice)
- [ ] Registered company name, company number and registered office address (footer and privacy notice), plus ICO registration
- [ ] Her Airbnb listing URL in `site.config.ts` → `bookingLinks.airbnb` once it exists
- [ ] Real reviews and figures once there's a track record (never invented ones; that's illegal in the UK under the DMCC Act 2024)
- [ ] Founder story on `/about` in her own words
- [ ] Have the FAQ answers and privacy notice checked against the real agreement (ideally by a solicitor)
- [ ] Swap stock photos for real properties as they come on board
- [ ] Turn on email delivery (above) and send a test enquiry

## Later (not in this demo)

- Real property listings linked to their individual Airbnb pages
- Direct booking
- Smart-lock / property-automation dashboard (check which devices offer APIs)
- Moving from free tiers to paid plans for reliability once the business is trading
