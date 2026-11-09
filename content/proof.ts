/**
 * ⚠️ PLACEHOLDER CONTENT. Every figure and testimonial below is made up for the
 * demo. Replace them with real ones, or set SHOW_PLACEHOLDER_PROOF to false to
 * hide the sections, before the site goes live. Publishing invented reviews or
 * figures breaks UK consumer protection law (DMCC Act 2024).
 */
export const SHOW_PLACEHOLDER_PROOF = true;

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "100%", label: "of rent paid on time, every month" },
  { value: "60–80%", label: "target occupancy for our homes" },
  { value: "£0", label: "management or letting fees for landlords" },
  { value: "3–5 yrs", label: "typical guaranteed agreement" },
];

export type Testimonial = { quote: string; name: string; detail: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "I'd had two difficult tenancies in a row. Now the rent lands on the first of every month and the flat looks better than when I handed it over.",
    name: "Sample landlord",
    detail: "2-bed flat · placeholder review",
  },
  {
    quote:
      "Clear contract, quick answers, and they handled the lender consent for me. It's the least stressful letting arrangement I've had.",
    name: "Sample landlord",
    detail: "3-bed house · placeholder review",
  },
  {
    quote:
      "Spotless, calm and close to the station. It felt more like a home than a hotel. We'll be back for our next work trip.",
    name: "Sample guest",
    detail: "5-night business stay · placeholder review",
  },
];
