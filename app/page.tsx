import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import {
  Benefits, ButtonLink, Compare, CtaBand, FaqSection, Hero, QuickAppraisal, SectionHead, SplitBand, StatsStrip, Steps, Testimonials,
} from "@/components/Sections";
import { landlordFaqs } from "@/content/faq";

export default function Home() {
  return (
    <>
      <Hero
        photo={site.photos.hero}
        scene="living"
        title="Guaranteed rent for your property, paid every month"
        lead="We rent your home on a fixed-term agreement, furnish it and look after it as short-stay accommodation. You get the same rent every month, with no fees and no empty months."
        aside={<QuickAppraisal />}
      >
        <div className="btn-row">
          <ButtonLink href="/landlords" variant="outline-light">How it works</ButtonLink>
        </div>
      </Hero>

      <StatsStrip float />

      <section className="section">
        <div className="container split split--reverse">
          <div className="split__media">
            <Photo src={site.photos.about} alt="A living room in one of our homes" scene="living" className="media--tall" />
          </div>
          <div>
            <h2>Hands-off income from your property</h2>
            <p className="lead">
              {site.name} rents homes from landlords, gets them ready for guests and runs them day to day. You get a fixed rent and one person to deal with.
            </p>
            <p>
              We handle the furnishing, bookings, cleaning, maintenance and bills. We inspect every home regularly and keep it to a higher standard than most long lets, so the property is looked after while it earns.
            </p>
            <div className="btn-row mt-lg">
              <ButtonLink href="/about" variant="ghost">About us</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead
            title="How it compares to a normal let"
            lead="You have one tenant, us, for the whole agreement."
          />
          <Compare />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="How it works" lead="Most landlords are being paid within a few weeks of the first visit." />
          <Steps />
        </div>
      </section>

      <SplitBand
        photo={site.photos.city}
        title="Who stays in our homes"
        body="Mostly people working in the city: contractors, consultants and staff on placement, plus families visiting for a week or two. They want a proper home rather than a hotel room."
        href="/landlords"
        label="More for landlords"
      />

      <section className="section">
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <SectionHead title="Why landlords work with us" />
            <Photo src={site.photos.refurb} alt="A newly furnished bedroom" scene="bedroom" className="media--wide" />
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
