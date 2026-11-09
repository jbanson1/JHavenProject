import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { IconArrow } from "@/components/Icons";
import { Checklist, Hero, Kicker, SectionHead } from "@/components/Sections";
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

function BookingButtons({ light = false }: { light?: boolean }) {
  const { airbnb, bookingCom } = site.bookingLinks;
  if (!airbnb && !bookingCom) return null;
  return (
    <div className="btn-row">
      {airbnb && (
        <a className="btn btn--airbnb" href={airbnb} target="_blank" rel="noopener noreferrer">
          Book on Airbnb <IconArrow />
        </a>
      )}
      {bookingCom && (
        <a className={`btn ${light ? "btn--outline-light" : "btn--ghost"}`} href={bookingCom} target="_blank" rel="noopener noreferrer">
          Book on Booking.com
        </a>
      )}
    </div>
  );
}

export default function Stay() {
  return (
    <>
      <Hero
        short
        photo={site.photos.city}
        scene="exterior"
        kicker="Stay with us"
        title="Feel at home, wherever work takes you"
        lead="Fully furnished, professionally cleaned homes for short and medium stays. Better space and value than a hotel, with everything you need."
      >
        <BookingButtons light />
      </Hero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our homes" title="A taste of where you could stay" lead="Every home has fast Wi-Fi, a proper workspace, quality linen and self check-in." />
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

      <section className="section section--sand" id="book">
        <div className="container split">
          <div>
            <Kicker>Book a stay</Kicker>
            <h2>Check availability and book on Airbnb</h2>
            <p className="lead">All our homes are listed on Airbnb, where you can see photos, prices, reviews and live availability, and book securely.</p>
            <Checklist items={["Self check-in at any time", "Professionally cleaned between every stay", "Weekly and monthly discounts on longer stays"]} />
            <div className="mt-lg">
              <BookingButtons />
            </div>
          </div>
          <div className="split__media">
            <Photo src={site.photos.kitchen} alt="A modern kitchen in one of our homes" scene="kitchen" className="media--wide" />
          </div>
        </div>
      </section>
    </>
  );
}
