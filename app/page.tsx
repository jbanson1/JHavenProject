import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { IconCheck } from "@/components/Icons";
import {
  ArrowButton, Benefits, Checklist, Compare, CtaBand, FaqSection, Hero, Kicker, MediaStack, QuickAppraisal, SectionHead, SplitBand, StatsStrip, Steps, Testimonials,
} from "@/components/Sections";
import { landlordFaqs } from "@/content/faq";

export default function Home() {
  return (
    <>
      <Hero
        photo={site.photos.hero}
        kicker="Rent-to-rent for landlords"
        title="Guaranteed rent for landlords, without the hassle"
        lead="We rent your property on a fixed-term agreement, refurbish it and run it as quality short-stay accommodation. You get a guaranteed monthly rent, hands-free management and no void periods."
        aside={<QuickAppraisal />}
      >
        <div className="btn-row">
          <ArrowButton href="/landlords" variant="outline-light">How it works</ArrowButton>
        </div>
        <ul className="hero-x__ticks">
          <li><IconCheck /> Rent paid on time, every month</li>
          <li><IconCheck /> No management or letting fees</li>
          <li><IconCheck /> Refurbished at our cost</li>
        </ul>
      </Hero>

      <StatsStrip float />

      <section className="section">
        <div className="container split split--reverse">
          <div className="split__media">
            <MediaStack
              photo={site.photos.about}
              alt="A bright, styled living room in one of our homes"
              scene="living"
              cardTitle="Paid on the same day"
              cardBody="Your rent lands on the date in your contract, every month, booked or not."
            />
          </div>
          <div>
            <Kicker>Who we are</Kicker>
            <h2>Reliable, hands-off income from your property</h2>
            <p className="lead">
              {site.name} partners with landlords to turn their homes into well-run serviced accommodation, and pays them a fixed rent for doing nothing at all.
            </p>
            <p>
              We take care of everything: furnishing, guest bookings, cleaning, maintenance and bills. Our homes are inspected regularly and kept to a higher standard than most traditional lets, so your asset is protected while it earns.
            </p>
            <Checklist items={["One company let, one point of contact", "Guests vetted and ID-checked", "Your property handed back in great condition"]} />
            <div className="btn-row mt-lg">
              <ArrowButton href="/about">More about us</ArrowButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead
            eyebrow="Why rent-to-rent"
            title="Letting the usual way, or letting to us"
            lead="You deal with one reliable tenant, us, instead of a stream of tenancies, agents and call-outs."
          />
          <Compare />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How it works" title="From first call to first payment" lead="Usually within a few weeks." />
          <Steps />
        </div>
      </section>

      <SplitBand
        photo={site.photos.city}
        kicker="Who stays in our homes"
        title="Homes where people want to stay"
        body="Business travellers, contractors and families visiting the city need somewhere better than a hotel room. Your property could be it, with none of the work landing on you."
        href="/landlords"
        label="See how it works for landlords"
      />

      <section className="section">
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <SectionHead eyebrow="Why landlords choose us" title="Everything a landlord wants, nothing they don't" />
            <Photo src={site.photos.refurb} alt="A calm, newly styled bedroom" scene="bedroom" className="media--wide" />
          </div>
          <Benefits />
        </div>
      </section>

      <Testimonials />

      <FaqSection items={landlordFaqs.slice(0, 5)} more />

      <CtaBand />
    </>
  );
}
