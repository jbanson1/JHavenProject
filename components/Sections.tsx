import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/site.config";
import { landlordFaqs, type Faq } from "@/content/faq";
import { SHOW_PLACEHOLDER_PROOF, stats, testimonials } from "@/content/proof";
import { BEDROOM_OPTIONS } from "@/lib/validate";
import { Photo, type Scene } from "./Photo";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "outline-light" | "light" | "ghost" }) {
  return (
    <Link href={href} className={`btn btn--${variant}`}>
      {children}
    </Link>
  );
}

export function SectionHead({ title, lead, id }: { title: ReactNode; lead?: ReactNode; id?: string }) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

/** Photo hero with copy on the left and an optional card on the right. */
export function Hero({
  photo, scene = "living", title, lead, children, aside, short = false,
}: { photo: string | null; scene?: Scene; title: ReactNode; lead?: ReactNode; children?: ReactNode; aside?: ReactNode; short?: boolean }) {
  return (
    <section className={`hero-x${short ? " hero-x--short" : ""}`}>
      <Photo src={photo} alt="" scene={scene} priority sizes="100vw" />
      <div className="container hero-x__inner">
        <div>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}

/** Small appraisal starter: sends the area and bedrooms on to the full contact form. */
export function QuickAppraisal() {
  return (
    <div className="quick-card">
      <h2>Free rental appraisal</h2>
      <p>Tell us where the property is and we&apos;ll come back with what we could pay each month.</p>
      <form action="/contact" method="get">
        <div className="field">
          <label htmlFor="qa-area">Postcode or area</label>
          <input id="qa-area" name="area" placeholder="e.g. E17" maxLength={100} />
        </div>
        <div className="field">
          <label htmlFor="qa-bedrooms">Bedrooms</label>
          <select id="qa-bedrooms" name="bedrooms" defaultValue="">
            <option value="" disabled>Choose</option>
            {BEDROOM_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn--primary">Continue</button>
      </form>
      <p className="quick-card__note">We reply within one working day.</p>
    </div>
  );
}

export function StatsStrip({ float = false }: { float?: boolean }) {
  if (!SHOW_PLACEHOLDER_PROOF) return null;
  const strip = (
    <>
      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center" style={{ margin: 0 }}><span className="placeholder-flag">Demo figures: confirm or replace before launch</span></p>
    </>
  );
  return float ? <div className="container stats-float">{strip}</div> : strip;
}

const comparison: [string, string, string][] = [
  ["Rent", "Changes with every tenancy", "Fixed for the length of the agreement"],
  ["Empty months", "No income between tenants", "Paid whether it's booked or not"],
  ["Fees", "10–15% management plus letting fees", "None"],
  ["Maintenance", "Calls, quotes and call-outs", "Day-to-day upkeep handled by us"],
  ["Bills and council tax", "Chasing tenants or paying between lets", "Paid by us"],
  ["Condition", "Wear and tear over time", "Refurbished and inspected regularly"],
];

export function Compare() {
  return (
    <table className="compare">
      <thead>
        <tr>
          <th scope="col"><span className="visually-hidden">Topic</span></th>
          <th scope="col">A normal let</th>
          <th scope="col" className="compare__new">Letting to {site.name}</th>
        </tr>
      </thead>
      <tbody>
        {comparison.map(([label, oldWay, newWay]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{oldWay}</td>
            <td className="compare__new">{newWay}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const steps = [
  { title: "We view the property", body: "A free visit. We look at the location, layout and condition, and tell you honestly whether it works for short stays." },
  { title: "We agree a fixed rent", body: "You get a written offer: a set monthly rent for a fixed term, usually 3–5 years." },
  { title: "We get it ready", body: "We decorate, furnish and photograph the home at our own cost." },
  { title: "You get paid", body: "We run it day to day. Your rent arrives on the same date every month." },
];

export function Steps() {
  return (
    <ol className="steps-row">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="steps-row__num">Step {i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export const benefits = [
  { title: "Guaranteed monthly rent", body: "A fixed amount, paid on time every month, whether the home is booked or not." },
  { title: "No void periods", body: "No gaps between tenants. If the property is empty for a week, that's our problem." },
  { title: "Maintenance handled", body: "We look after day-to-day upkeep and minor repairs, and inspect the property regularly." },
  { title: "Refurbished at our cost", body: "We redecorate and furnish the home, and hand it back in good condition." },
  { title: "Guests are checked", body: "ID checks, past reviews and clear house rules. No parties." },
  { title: "No fees", body: "No management or letting fees. One person to call about anything." },
];

export function Benefits() {
  return (
    <dl className="feature-list">
      {benefits.map(({ title, body }) => (
        <div key={title} className="feature">
          <dt>{title}</dt>
          <dd>{body}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Navy text panel beside a full-height photo. */
export function SplitBand({ photo, scene = "exterior", title, body, href, label }: { photo: string | null; scene?: Scene; title: string; body: string; href: string; label: string }) {
  return (
    <section className="split-band">
      <div className="split-band__text">
        <h2>{title}</h2>
        <p>{body}</p>
        <ButtonLink href={href} variant="light">{label}</ButtonLink>
      </div>
      <Photo src={photo} alt="" scene={scene} sizes="(max-width: 860px) 100vw, 50vw" />
    </section>
  );
}

export function Testimonials() {
  if (!SHOW_PLACEHOLDER_PROOF || testimonials.length === 0) return null;
  const [featured, ...rest] = testimonials;
  return (
    <section className="section section--sand" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <h2 id="reviews-title">What landlords and guests say</h2>
          <span className="placeholder-flag">Demo content: sample reviews to be replaced with real ones</span>
        </div>
        <div className="reviews">
          <figure className="review review--featured">
            <blockquote>&ldquo;{featured.quote}&rdquo;</blockquote>
            <figcaption><strong>{featured.name}</strong> · {featured.detail}</figcaption>
          </figure>
          <div className="reviews__side">
            {rest.slice(0, 2).map((t, i) => (
              <figure key={i} className="review">
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption><strong>{t.name}</strong> · {t.detail}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items = landlordFaqs }: { items?: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Heading and a short note on the left, questions on the right. */
export function FaqSection({ items, title = "Common questions", more = false, id }: { items?: Faq[]; title?: string; more?: boolean; id?: string }) {
  return (
    <section className="section" id={id}>
      <div className="container faq-layout">
        <div className="faq-layout__aside">
          <h2>{title}</h2>
          <p className="lead">
            Something we haven&apos;t covered? <Link href="/contact">Get in touch</Link> or call {site.contact.phone || "us"}.
          </p>
        </div>
        <div>
          <FaqList items={items} />
          {more && (
            <p className="mt-lg"><Link href="/landlords#faq">More landlord questions</Link></p>
          )}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Find out what your property could earn",
  body = "Book a free, no-obligation appraisal. We'll visit, go through the numbers with you and send a written offer within 48 hours.",
  href = "/contact",
  label = "Book an appraisal",
}: { title?: string; body?: string; href?: string; label?: string }) {
  return (
    <section className="section" aria-label="Get in touch">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div>
            <ButtonLink href={href} variant="light">{label}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Guests book through Airbnb rather than the contact form. */
export function AirbnbCard() {
  const url = site.bookingLinks.airbnb;
  if (!url) return null;
  return (
    <div className="guest-card">
      <div>
        <h3>Looking for somewhere to stay?</h3>
        <p>Our homes, prices and availability are on Airbnb.</p>
      </div>
      <a className="btn btn--airbnb" href={url} target="_blank" rel="noopener noreferrer">View on Airbnb</a>
    </div>
  );
}

export const values = [
  { title: "Straight answers", body: "Clear contracts and honest numbers. If a property isn't right for short stays, we'll tell you." },
  { title: "We look after it", body: "We treat every home as if it were our own. It's your investment, and our reputation." },
  { title: "We pick up the phone", body: "Rent on time, every time, and a real person to speak to when you need us." },
];
