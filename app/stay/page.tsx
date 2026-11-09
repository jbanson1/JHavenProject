import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { ContactForm } from "@/components/ContactForm";
import { PhotoHero, SectionHead } from "@/components/Sections";
import type { Scene } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Stay with us",
  description: `Comfortable, fully furnished short and medium stays from ${site.name}. Ideal for business trips, contractors and visiting family.`,
};

// Placeholder homes for the demo. Replace with real listings when available.
const homes: { title: string; meta: string; tag: string; scene: Scene }[] = [
  { title: "Bright one-bed apartment", meta: "Sleeps 2 · Near the station · Fast Wi-Fi", tag: "Business stays", scene: "living" },
  { title: "Calm two-bed flat", meta: "Sleeps 4 · Full kitchen · Washer-dryer", tag: "Contractors", scene: "bedroom" },
  { title: "Cosy family home", meta: "Sleeps 6 · Garden · Free parking", tag: "Families", scene: "kitchen" },
];

export default function Stay() {
  const { airbnb, bookingCom } = site.bookingLinks;
  return (
    <>
      <PhotoHero
        short
        photo={site.photos.city}
        scene="exterior"
        title="Feel at home, wherever work takes you"
        lead="Fully furnished, professionally cleaned homes for short and medium stays. Better space and value than a hotel, with everything you need."
      >
        {(airbnb || bookingCom) && (
          <div className="btn-row" style={{ justifyContent: "center" }}>
            {airbnb && <a className="btn btn--light" href={airbnb} target="_blank" rel="noopener noreferrer">Book on Airbnb</a>}
            {bookingCom && <a className="btn btn--outline-light" href={bookingCom} target="_blank" rel="noopener noreferrer">Book on Booking.com</a>}
          </div>
        )}
      </PhotoHero>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Our homes" title="A taste of where you could stay" lead="Every home has fast Wi-Fi, a proper workspace, quality linen and self check-in." />
          <div className="grid grid--3">
            {homes.map((h, i) => (
              <article key={h.title} className="property-card">
                <Photo src={site.photos.stays[i] ?? null} alt={h.title} scene={h.scene} sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="property-card__body">
                  <span className="tag">{h.tag}</span>
                  <h3>{h.title}</h3>
                  <p className="property-card__meta">{h.meta}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center"><span className="placeholder-flag">Demo content: example homes to be replaced with real listings</span></p>
        </div>
      </section>

      <section className="section section--sand" id="enquire">
        <div className="container contact-grid">
          <div>
            <span className="pill-label">Enquire</span>
            <h2>Looking for somewhere to stay?</h2>
            <p className="lead">Tell us your dates and what you need. We&apos;ll reply with available homes and prices, usually the same day.</p>
            <p>Booking for a team or a longer project? Ask about our corporate rates.</p>
          </div>
          <ContactForm initialType="guest" allowSwitch={false} />
        </div>
      </section>
    </>
  );
}
