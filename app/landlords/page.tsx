import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { Benefits, ButtonLink, Compare, CtaBand, FaqSection, Hero, SectionHead, Steps } from "@/components/Sections";

export const metadata: Metadata = {
  title: "For landlords",
  description: `Guaranteed rent, no void periods and no management fees. How ${site.name}'s rent-to-rent agreements work for landlords.`,
};

export default function Landlords() {
  return (
    <>
      <Hero
        short
        photo={site.photos.handshake}
        title="One reliable tenant, for years"
        lead="We take your property on a fixed-term company let and look after everything else. The rent is fixed and paid on time every month."
      >
        <div className="btn-row">
          <ButtonLink href="/contact">Book an appraisal</ButtonLink>
        </div>
      </Hero>

      <section className="section">
        <div className="container split">
          <div>
            <h2>What rent-to-rent means for you</h2>
            <p className="lead">
              Instead of letting to a household, you let to us. We furnish the property and host short and medium stays for people working or visiting in the area.
            </p>
            <p>
              Your rent is written into the contract, so it doesn&apos;t depend on how busy the property is. We aim for 60–80% occupancy, and that risk is ours.
            </p>
            <ul>
              <li>A fixed monthly rent for 3–5 years, with break clauses agreed up front</li>
              <li>Utilities, council tax, broadband and cleaning paid by us</li>
              <li>Regular inspections, with photos sent to you</li>
              <li>Mortgage, freeholder and council permissions checked before we sign</li>
            </ul>
          </div>
          <div className="split__media">
            <Photo src={site.photos.kitchen} alt="A furnished kitchen" scene="kitchen" className="media--tall" />
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead title="How it works" />
          <Steps />
        </div>
      </section>

      <section className="section">
        <div className="container split split--reverse">
          <div className="split__media">
            <Photo src={site.photos.refurb} alt="A newly styled bedroom" scene="bedroom" className="media--tall" />
          </div>
          <div>
            <h2>We improve the property, at our cost</h2>
            <p className="lead">Before the first guest arrives, we redecorate, furnish and style the home.</p>
            <p>
              Fresh paint, decent furniture and good linen mean better reviews and guests who take care of the place. Nothing structural changes without your written agreement, and the property comes back to you in the same or better condition.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead title="Why landlords work with us" />
          <Benefits />
          <div className="mt-lg">
            <Compare />
          </div>
        </div>
      </section>

      <FaqSection id="faq" title="Landlord questions" />

      <CtaBand />
    </>
  );
}
