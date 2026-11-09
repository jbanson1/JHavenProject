import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { ArrowButton, Benefits, Checklist, CtaBand, FaqList, PhotoHero, SectionHead, Steps } from "@/components/Sections";

export const metadata: Metadata = {
  title: "For landlords",
  description: `Guaranteed rent, no void periods and no management fees. How ${site.name}'s rent-to-rent agreements work for landlords.`,
};

export default function Landlords() {
  return (
    <>
      <PhotoHero
        short
        photo={site.photos.handshake}
        title="A tenant you can rely on, for years"
        lead="We become your tenant on a fixed-term company let, then take care of everything else. Fixed rent, paid on time, every month."
      >
        <div className="btn-row">
          <ArrowButton href="/contact">Get a guaranteed rent offer</ArrowButton>
        </div>
      </PhotoHero>

      <section className="section">
        <div className="container split">
          <div>
            <span className="pill-label">The arrangement</span>
            <h2>What rent-to-rent means for you</h2>
            <p className="lead">
              Instead of letting to a household, you let to us. We furnish the property and host short and medium stays for professionals, contractors and visitors.
            </p>
            <p>
              Your income is fixed in the contract, so it doesn&apos;t depend on how busy the property is. We aim for 60–80% occupancy, and that risk sits entirely with us.
            </p>
            <Checklist items={[
              "Fixed monthly rent for 3–5 years, with agreed break clauses",
              "Utilities, council tax, broadband and cleaning paid by us",
              "Regular inspections and photo reports",
              "Lender, freeholder and local-authority permissions checked before we sign",
            ]} />
          </div>
          <div className="split__media">
            <Photo src={site.photos.kitchen} alt="A modern, freshly furnished kitchen" scene="kitchen" className="media--tall" />
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead center eyebrow="How it works" title="From first call to first payment" />
          <Steps />
        </div>
      </section>

      <section className="section">
        <div className="container split split--reverse">
          <div className="split__media">
            <Photo src={site.photos.refurb} alt="A calm, newly styled bedroom" scene="bedroom" className="media--tall" />
          </div>
          <div>
            <span className="pill-label">Refurbishment</span>
            <h2>We improve your property, at our cost</h2>
            <p className="lead">Before the first guest arrives, we redecorate, furnish and style the home to a hotel-quality standard.</p>
            <p>
              Fresh paint, quality furniture, good linen and thoughtful touches mean better reviews, more careful guests and a property that is handed back in the same or better condition than we found it. Nothing structural changes without your written agreement.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead center eyebrow="Benefits" title="Why landlords work with us" />
          <Benefits />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <SectionHead center eyebrow="FAQ" title="Landlord questions, answered" lead="Can't see your question? Call or message us. We're happy to talk it through." />
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <FaqList />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
