import Link from "next/link";
import type { ReactNode } from "react";
import { landlordFaqs, type Faq } from "@/content/faq";
import { SHOW_PLACEHOLDER_PROOF, stats, testimonials } from "@/content/proof";
import { Photo, type Scene } from "./Photo";
import {
  IconArrow, IconCalendar, IconChat, IconCheck, IconClose, IconHandshake, IconHome, IconKey, IconPound, IconShield, IconSparkle, IconTools,
} from "./Icons";

/** Pill button with the round arrow chip. */
export function ArrowButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "outline-light" }) {
  return (
    <Link href={href} className={`btn btn--${variant} btn--arrow`}>
      {children}
      <span className="btn__chip"><IconArrow /></span>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, lead, center = false, id }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      {eyebrow && <span className="pill-label">{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

/** Full-bleed photo hero with dark overlay. */
export function PhotoHero({
  photo, scene = "living", title, lead, children, short = false,
}: { photo: string | null; scene?: Scene; title: ReactNode; lead?: ReactNode; children?: ReactNode; short?: boolean }) {
  return (
    <section className={`photo-hero${short ? " photo-hero--short" : ""}`}>
      <div className="photo-hero__frame">
        <Photo src={photo} alt="" scene={scene} priority sizes="100vw" />
        <div className="photo-hero__content">
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function PhotoBand({ photo, scene = "exterior", title, body, href, label }: { photo: string | null; scene?: Scene; title: string; body: string; href: string; label: string }) {
  return (
    <section className="photo-band">
      <Photo src={photo} alt="" scene={scene} sizes="100vw" />
      <div className="photo-band__content">
        <h2>{title}</h2>
        <p>{body}</p>
        <ArrowButton href={href}>{label}</ArrowButton>
      </div>
    </section>
  );
}

export const steps = [
  { icon: IconHome, title: "We view your property", body: "A free, no-obligation visit. We check the location, layout and condition, and tell you honestly if it suits short stays." },
  { icon: IconHandshake, title: "We agree a fixed rent", body: "A clear written offer: guaranteed monthly rent for a fixed term, typically 3–5 years. No commission, no hidden fees." },
  { icon: IconSparkle, title: "We refurbish and furnish", body: "At our cost, we decorate, furnish and style the home so guests love it and look after it." },
  { icon: IconPound, title: "You get paid every month", body: "We run everything day to day. Your rent arrives on the same date every month." },
];

export function Steps() {
  return (
    <ol className="grid grid--4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {steps.map(({ icon: Icon, title, body }, i) => (
        <li key={title} className="step-card">
          <div className="step-card__icon"><Icon /><span className="step-card__num">{i + 1}</span></div>
          <h3>{title}</h3>
          <p>{body}</p>
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
    <div className="grid grid--3">
      {benefits.map(({ icon: Icon, title, body }) => (
        <div key={title} className="card">
          <div className="icon-badge"><Icon /></div>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

/** "What we do" next to "Who this is for": the landlord's problems and our answer. */
export function WhatWeDo() {
  return (
    <div className="grid grid--2">
      <div className="duo-card">
        <h3>What we do</h3>
        <p>We work with landlords and letting agents by:</p>
        <Checklist variant="dots" items={[
          "Renting your property on a company let agreement",
          "Paying you a guaranteed rent every month",
          "Furnishing and running it as serviced accommodation",
          "Handling guests, cleaning, maintenance and bills",
        ]} />
        <p className="duo-card__close">You deal with one tenant, us, not a stream of guests.</p>
      </div>
      <div className="duo-card">
        <h3>Who this is for</h3>
        <p>Landlords who are tired of:</p>
        <Checklist variant="warn" icon="close" items={[
          "Void periods and unpredictable income",
          "Late payments and problem tenancies",
          "Constant maintenance calls and admin",
          "Viewings, referencing and agent fees",
        ]} />
        <p className="duo-card__close">We take all of that off your hands.</p>
      </div>
    </div>
  );
}

export function Stats() {
  if (!SHOW_PLACEHOLDER_PROOF) return null;
  return (
    <div>
      <div className="stats stats--panel">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center" style={{ margin: 0 }}><span className="placeholder-flag">Demo figures: confirm or replace before launch</span></p>
    </div>
  );
}

export function Testimonials() {
  if (!SHOW_PLACEHOLDER_PROOF) return null;
  return (
    <section className="section section--sand" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="pill-label">Reviews</span>
          <h2 id="reviews-title">What landlords and guests say</h2>
          <span className="placeholder-flag">Demo content: sample reviews to be replaced with real ones</span>
        </div>
        <div className="grid grid--3">
          {testimonials.map((t, i) => (
            <figure key={i} className="card quote">
              <blockquote>{t.quote}</blockquote>
              <figcaption><strong>{t.name}</strong>{t.detail}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items = landlordFaqs }: { items?: Faq[] }) {
  return (
    <div className="faq faq--cards">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
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
            <Link href={href} className="btn btn--light btn--arrow">
              {label}
              <span className="btn__chip" style={{ background: "var(--accent)", color: "#fff" }}><IconArrow /></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Checklist({ items, variant, icon = "check" }: { items: ReactNode[]; variant?: "dots" | "warn"; icon?: "check" | "close" }) {
  const Icon = icon === "close" ? IconClose : IconCheck;
  return (
    <ul className={`checklist${variant ? ` checklist--${variant}` : ""}`}>
      {items.map((it, i) => (
        <li key={i}><Icon />{it}</li>
      ))}
    </ul>
  );
}

export const values = [
  { icon: IconChat, title: "Transparency", body: "Clear contracts, honest numbers and straight answers. If a property isn't right for short stays, we'll say so." },
  { icon: IconHome, title: "Care", body: "We look after every home as if it were our own, because your property is your investment." },
  { icon: IconKey, title: "Reliability", body: "Rent on time, every time, and a real person who picks up the phone when you need us." },
];
