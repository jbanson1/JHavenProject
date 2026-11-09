import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { site } from "@/site.config";
import { landlordFaqs, type Faq } from "@/content/faq";
import { SHOW_PLACEHOLDER_PROOF, stats, testimonials } from "@/content/proof";
import { BEDROOM_OPTIONS } from "@/lib/validate";
import { Photo, type Scene } from "./Photo";
import {
  IconArrow, IconCalendar, IconChat, IconCheck, IconClose, IconHandshake, IconHome, IconKey, IconPound, IconShield, IconSparkle, IconTools,
} from "./Icons";

/** Button with a trailing arrow. */
export function ArrowButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "outline-light" | "light" }) {
  return (
    <Link href={href} className={`btn btn--${variant}`}>
      {children}
      <IconArrow />
    </Link>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className="kicker">{children}</span>;
}

export function SectionHead({ eyebrow, title, lead, center = false, id }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      {eyebrow && <Kicker>{eyebrow}</Kicker>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

/** Photo hero with copy on the left and an optional card on the right. */
export function Hero({
  photo, scene = "living", kicker, title, lead, children, aside, short = false,
}: { photo: string | null; scene?: Scene; kicker?: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; aside?: ReactNode; short?: boolean }) {
  return (
    <section className={`hero-x${short ? " hero-x--short" : ""}`}>
      <Photo src={photo} alt="" scene={scene} priority sizes="100vw" />
      <div className="container hero-x__inner">
        <div>
          {kicker && <Kicker>{kicker}</Kicker>}
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
      <p>See what we could pay you each month. No obligation.</p>
      <form action="/contact" method="get">
        <div className="field">
          <label htmlFor="qa-area">Property postcode or area</label>
          <input id="qa-area" name="area" placeholder="e.g. E17 or Walthamstow" maxLength={100} />
        </div>
        <div className="field">
          <label htmlFor="qa-bedrooms">Bedrooms</label>
          <select id="qa-bedrooms" name="bedrooms" defaultValue="">
            <option value="" disabled>Choose one</option>
            {BEDROOM_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn--primary">Get my appraisal <IconArrow /></button>
      </form>
      <p className="quick-card__note"><IconShield /> We reply within one working day</p>
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

/** Photo with an overlapping highlight card. */
export function MediaStack({ photo, alt, scene, cardTitle, cardBody }: { photo: string | null; alt: string; scene: Scene; cardTitle: string; cardBody: string }) {
  return (
    <div className="media-stack">
      <Photo src={photo} alt={alt} scene={scene} className="media--tall" />
      <div className="media-stack__card">
        <IconCalendar />
        <div><strong>{cardTitle}</strong><span>{cardBody}</span></div>
      </div>
    </div>
  );
}

const comparison: [string, string, string][] = [
  ["Rent", "Changes with every tenancy", "Fixed and guaranteed for years"],
  ["Empty months", "Void periods with no income", "Paid whether it's booked or not"],
  ["Fees", "10–15% management plus letting fees", "No fees at all"],
  ["Maintenance", "Calls, quotes and call-outs", "Day-to-day upkeep handled by us"],
  ["Bills & council tax", "Chasing tenants or paying between lets", "Paid by us throughout"],
  ["Your property", "Wear and tear over time", "Refurbished and inspected regularly"],
];

export function Compare() {
  return (
    <div className="compare" role="table" aria-label={`Letting the usual way compared with letting to ${site.name}`}>
      <div className="compare__row compare__head" role="row">
        <div className="compare__label" role="columnheader"><span className="visually-hidden">Topic</span></div>
        <div className="compare__old" role="columnheader">The usual way</div>
        <div className="compare__new" role="columnheader">With {site.name}</div>
      </div>
      {comparison.map(([label, oldWay, newWay]) => (
        <div className="compare__row" role="row" key={label}>
          <div className="compare__label" role="rowheader">{label}</div>
          <div className="compare__old" role="cell"><IconClose />{oldWay}</div>
          <div className="compare__new" role="cell"><IconCheck />{newWay}</div>
        </div>
      ))}
    </div>
  );
}

export const steps = [
  { title: "We view your property", body: "A free, no-obligation visit. We check the location, layout and condition, and tell you honestly if it suits short stays." },
  { title: "We agree a fixed rent", body: "A clear written offer: guaranteed monthly rent for a fixed term, typically 3–5 years. No commission, no hidden fees." },
  { title: "We refurbish and furnish", body: "At our cost, we decorate, furnish and style the home so guests love it and look after it." },
  { title: "You get paid every month", body: "We run everything day to day. Your rent arrives on the same date every month." },
];

export function Steps() {
  return (
    <ol className="timeline">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="timeline__num">{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export const benefits = [
  { icon: IconPound, title: "Guaranteed monthly rent", body: "A fixed amount, paid on time, every month, whether the home is booked or not." },
  { icon: IconCalendar, title: "No void periods", body: "No gaps between tenants and no months without income. Occupancy is our risk, not yours." },
  { icon: IconTools, title: "Maintenance handled", body: "We look after day-to-day upkeep and minor repairs, and inspect the property regularly." },
  { icon: IconSparkle, title: "Refurbished at our cost", body: "Your home is redecorated and furnished to a high standard, and handed back in great condition." },
  { icon: IconShield, title: "Vetted, verified guests", body: "ID checks, review history and clear house rules. No parties, ever." },
  { icon: IconHandshake, title: "Zero fees", body: "No management fees, no letting fees, no hidden costs. One point of contact for everything." },
];

export function Benefits() {
  return (
    <div className="feature-list">
      {benefits.map(({ icon: Icon, title, body }) => (
        <div key={title} className="feature">
          <div className="icon-badge"><Icon /></div>
          <div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Navy text panel beside a full-height photo. */
export function SplitBand({ photo, scene = "exterior", kicker, title, body, href, label }: { photo: string | null; scene?: Scene; kicker?: string; title: string; body: string; href: string; label: string }) {
  return (
    <section className="split-band">
      <div className="split-band__text">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2>{title}</h2>
        <p>{body}</p>
        <ArrowButton href={href} variant="light">{label}</ArrowButton>
      </div>
      <Photo src={photo} alt="" scene={scene} sizes="(max-width: 860px) 100vw, 50vw" />
    </section>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function Testimonials() {
  if (!SHOW_PLACEHOLDER_PROOF || testimonials.length === 0) return null;
  const [featured, ...rest] = testimonials;
  const card = (t: (typeof testimonials)[number], cls = "") => (
    <figure className={`review ${cls}`}>
      <div>
        <div className="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
        <blockquote>{t.quote}</blockquote>
      </div>
      <figcaption>
        <span className="review__avatar" aria-hidden="true">{initials(t.name)}</span>
        <span><strong>{t.name}</strong>{t.detail}</span>
      </figcaption>
    </figure>
  );
  return (
    <section className="section section--sand" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <Kicker>Reviews</Kicker>
          <h2 id="reviews-title">What landlords and guests say</h2>
          <span className="placeholder-flag">Demo content: sample reviews to be replaced with real ones</span>
        </div>
        <div className="reviews">
          {card(featured, "review--featured")}
          <div className="reviews__side">{rest.slice(0, 2).map((t, i) => <Fragment key={i}>{card(t)}</Fragment>)}</div>
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

/** Heading and help card on the left, questions on the right. */
export function FaqSection({ items, title = "Questions landlords ask us", more = false, id }: { items?: Faq[]; title?: string; more?: boolean; id?: string }) {
  return (
    <section className="section" id={id}>
      <div className="container faq-layout">
        <div className="faq-layout__aside">
          <Kicker>FAQ</Kicker>
          <h2>{title}</h2>
          <div className="help-card">
            <h3>Still have a question?</h3>
            <p>We&apos;re happy to talk it through, with no pressure and no jargon.</p>
            <ArrowButton href="/contact">Ask us directly</ArrowButton>
          </div>
        </div>
        <div>
          <FaqList items={items} />
          {more && (
            <p className="mt-lg"><Link href="/landlords#faq">See all landlord questions →</Link></p>
          )}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Find out what your property could earn you",
  body = "Book a free, no-obligation appraisal. We'll visit, talk you through the numbers and send a written offer within 48 hours.",
  href = "/contact",
  label = "Get a guaranteed rent offer",
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
            <ArrowButton href={href} variant="light">{label}</ArrowButton>
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
        <h3>Looking for a place to stay?</h3>
        <p>See our homes, prices and availability on Airbnb.</p>
      </div>
      <a className="btn btn--airbnb" href={url} target="_blank" rel="noopener noreferrer">
        View on Airbnb <IconArrow />
      </a>
    </div>
  );
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="checklist">
      {items.map((it, i) => (
        <li key={i}><IconCheck />{it}</li>
      ))}
    </ul>
  );
}

export const values = [
  { icon: IconChat, title: "Transparency", body: "Clear contracts, honest numbers and straight answers. If a property isn't right for short stays, we'll say so." },
  { icon: IconHome, title: "Care", body: "We look after every home as if it were our own, because your property is your investment." },
  { icon: IconKey, title: "Reliability", body: "Rent on time, every time, and a real person who picks up the phone when you need us." },
];
