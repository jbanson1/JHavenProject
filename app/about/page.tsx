import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { ButtonLink, CtaBand, SectionHead, StatsStrip, values } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About us",
  description: `Who we are and why landlords trust ${site.name} with their properties.`,
};

export default function About() {
  return (
    <>
      <section className="page-hero section--sand">
        <div className="container">
          <h1>About {site.name}</h1>
          <p className="lead">
            We started {site.name} because being a landlord should feel secure, not stressful. Owners get a reliable income, and guests get a home that&apos;s properly looked after.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Why we started</h2>
            {/* TODO: replace with the founder's own story in her words. */}
            <p>
              The landlords we spoke to were tired of empty months, late payments and constant call-outs. At the same time, people coming to the city for work struggled to find somewhere comfortable and well located that didn&apos;t cost hotel prices.
            </p>
            <p>
              So we bring the two together. We take on homes for the long term, put money into making them nice to live in, and run them properly. Owners get peace of mind and guests get a decent place to stay.
            </p>
            <p>
              We&apos;re a small team. When you call, you speak to the person who looks after your property.
            </p>
            <div className="btn-row mt-lg">
              <ButtonLink href="/contact">Get in touch</ButtonLink>
            </div>
          </div>
          <div className="split__media">
            <Photo src={site.photos.about} alt="A living room in one of our homes" scene="living" className="media--tall" />
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead title="How we work" />
          <dl className="feature-list feature-list--3">
            {values.map(({ title, body }) => (
              <div key={title} className="feature">
                <dt>{title}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            title="Where we work"
            lead={
              <>
                We currently take on properties in {site.areas.join(" and ")}.
                {site.futureAreas.length > 0 && <> We&apos;re also planning to expand to {site.futureAreas.join(" and ")}.</>}
              </>
            }
          />
          <StatsStrip />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
