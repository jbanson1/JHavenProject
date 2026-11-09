import type { Metadata } from "next";
import { site } from "@/site.config";
import { Photo } from "@/components/Photo";
import { IconPin } from "@/components/Icons";
import { ArrowButton, CtaBand, SectionHead, Stats, values } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About us",
  description: `Who we are and why landlords trust ${site.name} with their properties.`,
};

export default function About() {
  return (
    <>
      <section className="page-hero section--sand">
        <div className="container">
          <span className="pill-label">About {site.name}</span>
          <h1>Looking after homes, and the people who own them</h1>
          <p className="lead">
            {site.name} was founded on a simple idea: being a landlord should feel secure, not stressful. We give owners a reliable income and give guests a home that feels cared for.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="pill-label">Our story</span>
            <h2>Why we started</h2>
            {/* TODO: replace with the founder's own story in her words. */}
            <p>
              Too many landlords we spoke to were worn out by void months, late payments and constant call-outs. At the same time, professionals visiting the city struggled to find somewhere comfortable, well-located and good value to stay.
            </p>
            <p>
              We bring the two together. We take on homes for the long term, invest in making them beautiful, and run them to a hotel standard, so owners get peace of mind and guests get a proper place to stay.
            </p>
            <p>
              We&apos;re a small, hands-on team. When you call, you speak to the person who looks after your property.
            </p>
            <div className="btn-row mt-lg">
              <ArrowButton href="/contact">Talk to us</ArrowButton>
            </div>
          </div>
          <div className="split__media">
            <Photo src={site.photos.about} alt="A warm, welcoming living room" scene="living" className="media--tall" />
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead center eyebrow="Our values" title="What you can expect from us" />
          <div className="grid grid--3">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card">
                <div className="icon-badge"><Icon /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Where we work" title="Areas we cover" />
          <div className="grid grid--3" style={{ maxWidth: 900, margin: "0 auto" }}>
            {site.areas.map((a) => (
              <div key={a} className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div className="icon-badge" style={{ margin: 0 }}><IconPin /></div>
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{a}</h3>
              </div>
            ))}
            {site.futureAreas.map((a) => (
              <div key={a} className="card" style={{ display: "flex", gap: 14, alignItems: "center", borderStyle: "dashed" }}>
                <div className="icon-badge" style={{ margin: 0 }}><IconPin /></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{a}</h3>
                  <p style={{ fontSize: "0.88rem" }}>Coming soon</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-lg">
            <Stats />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
