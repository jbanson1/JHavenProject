import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { Hero, SectionHead } from "@/components/Sections";
import type { Scene } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Stay with us",
  description: `Furnished short and medium stays from ${site.name}, for work trips, contractors and visiting family.`,
};

// What every home will have. Photos are illustrative until real ones are added
// in site.config.ts → photos.stays.
const expect: { title: string; body: string; scene: Scene }[] = [
  { title: "Space to live", body: "A proper living room and kitchen, not just a bedroom.", scene: "living" },
  { title: "Rest properly", body: "Good beds, quality linen and blackout blinds.", scene: "bedroom" },
  { title: "Work from home", body: "Fast Wi-Fi and a desk, for stays of a few nights or a few months.", scene: "kitchen" },
];

function BookingButtons({ light = false }: { light?: boolean }) {
  const { airbnb, bookingCom } = site.bookingLinks;
  if (!airbnb && !bookingCom) return null;
  return (
    <div className="btn-row">
      {airbnb && (
        <a className="btn btn--airbnb" href={airbnb} target="_blank" rel="noopener noreferrer">Book on Airbnb</a>
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
  const listed = Boolean(site.bookingLinks.airbnb || site.bookingLinks.bookingCom);
  return (
    <>
      <Hero
        short
        photo={site.photos.city}
        scene="exterior"
        title="Places to stay"
        lead="Furnished, professionally cleaned homes for short and medium stays. More space than a hotel room, with a proper kitchen and somewhere to work."
      >
        <BookingButtons light />
      </Hero>

      <section className="section">
        <div className="container">
          <SectionHead title="What to expect" lead="Every home comes with self check-in and is cleaned professionally between stays." />
          <div className="grid grid--3">
            {expect.map((h, i) => (
              <article key={h.title} className="property-card">
                <Photo src={site.photos.stays[i] ?? null} alt="" scene={h.scene} sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="property-card__body">
                  <h3>{h.title}</h3>
                  <p className="property-card__meta">{h.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand" id="book">
        <div className="container split">
          <div>
            {listed ? (
              <>
                <h2>Book a stay</h2>
                <p className="lead">See photos, prices and live availability, and book securely.</p>
                <div className="mt-lg"><BookingButtons /></div>
              </>
            ) : (
              <>
                <h2>Our first homes are coming soon</h2>
                <p className="lead">
                  We&apos;re getting our first homes ready now. They&apos;ll be bookable on Airbnb and Booking.com.
                </p>
                <p>
                  Planning a stay or booking for a team? Email{" "}
                  <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Stay enquiry")}`}>{site.contact.email}</a>{" "}
                  and we&apos;ll let you know when homes are available.
                </p>
              </>
            )}
          </div>
          <div className="split__media">
            <Photo src={site.photos.kitchen} alt="" scene="kitchen" className="media--wide" />
          </div>
        </div>
      </section>
    </>
  );
}
