import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { IconCheck } from "@/components/Icons";
import {
  ArrowButton, Benefits, Checklist, CtaBand, FaqList, PhotoBand, PhotoHero, SectionHead, Stats, Steps, Testimonials, WhatWeDo,
} from "@/components/Sections";
import { landlordFaqs } from "@/content/faq";

export default function Home() {
  return (
    <>
      <PhotoHero
        photo={site.photos.hero}
        title="Guaranteed rent for landlords, without the hassle"
        lead="We rent your property on a fixed-term agreement, refurbish it and run it as quality short-stay accommodation. You get a guaranteed monthly rent, hands-free management and no void periods."
      >
        <div className="btn-row">
          <ArrowButton href="/contact">Get a guaranteed rent offer</ArrowButton>
          <ArrowButton href="/landlords" variant="outline-light">How it works</ArrowButton>
        </div>
        <ul className="photo-hero__badges">
          <li><IconCheck /> Rent paid on time, every month</li>
          <li><IconCheck /> No management fees</li>
          <li><IconCheck /> Free refurbishment</li>
        </ul>
      </PhotoHero>

      <section className="section">
        <div className="container split">
          <div>
            <span className="pill-label">Who we are</span>
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
          <div className="split__media">
            <Photo src={site.photos.about} alt="A bright, styled living room in one of our homes" scene="living" className="media--tall media--notch" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Key figures">
        <div className="container">
          <Stats />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <WhatWeDo />
        </div>
      </section>

      <PhotoBand
        photo={site.photos.city}
        title="Homes where people want to stay"
        body="Business travellers, contractors and families visiting the city need somewhere better than a hotel room. Your property could be it, with none of the work landing on you."
        href="/landlords"
        label="See how it works for landlords"
      />

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="How it works" title="Four simple steps" lead="From first call to first payment, usually within a few weeks." />
          <Steps />
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead center eyebrow="Why landlords choose us" title="Everything a landlord wants, nothing they don't" />
          <Benefits />
        </div>
      </section>

      <Testimonials />

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="FAQ" title="Questions landlords ask us" />
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <FaqList items={landlordFaqs.slice(0, 5)} />
            <p className="text-center mt-lg">
              <ArrowButton href="/landlords#faq">See all questions</ArrowButton>
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
