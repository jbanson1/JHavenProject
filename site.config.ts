/**
 * Everything brand-related lives here. Change the name, contact details,
 * areas or photos in this one file and the whole site follows.
 *
 * Colours and fonts live in app/globals.css (the :root variables at the top).
 */
export const site = {
  /** Working name. "HavenLux", "Havn" etc. are a one-line change. */
  name: "Haven",
  /** Short line shown under the name in the footer and in search results. */
  tagline: "Guaranteed rent for landlords. Beautiful stays for guests.",
  description:
    "Haven rents homes from landlords on fixed-term agreements, refurbishes and furnishes them, and manages them as serviced short stays. Guaranteed monthly rent, no void periods and no management fees.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haven-demo.vercel.app",

  contact: {
    email: "hello@example.com", // TODO: replace with the real inbox
    phone: "+44 0000 000000", // TODO: replace, or set to "" to hide
    hours: "Mon–Sat, 9am–6pm",
    /** WhatsApp number in international format without "+" or spaces, e.g. "447700900123". "" hides the button. */
    whatsapp: "",
  },

  /** Where we currently take on properties. The first item is the main area. */
  areas: ["London", "Greater London commuter towns"],
  /** Shown as "coming soon" on the About page. Set to [] to hide. */
  futureAreas: ["Jamaica"],

  /**
   * Guest booking links. Guests are sent to Airbnb instead of the contact form.
   * TODO: replace with her Airbnb host profile or listing URL. "" hides the button.
   */
  bookingLinks: {
    airbnb: "https://www.airbnb.co.uk/",
    bookingCom: "",
  },

  social: {
    instagram: "", // e.g. "https://instagram.com/yourhandle"
    linkedin: "",
    facebook: "",
  },

  /** Placeholder legal details for the footer. Replace once the company is registered. */
  legal: {
    companyName: "Haven (trading name)",
    companyNumber: "", // e.g. "Registered in England & Wales No. 00000000"
  },

  /**
   * Photos (free Unsplash stock for now, see public/images/README.md).
   * Swap for real property photos by replacing the files or changing the paths.
   * Set a value to null to show a drawn placeholder instead.
   */
  photos: {
    hero: "/images/hero-living.jpg" as string | null,
    about: "/images/about.jpg" as string | null,
    refurb: "/images/refurb.jpg" as string | null,
    kitchen: "/images/kitchen.jpg" as string | null,
    city: "/images/london.jpg" as string | null,
    handshake: "/images/handshake.jpg" as string | null,
    stays: ["/images/stay-1.jpg", "/images/stay-2.jpg", "/images/stay-3.jpg"] as (string | null)[],
  },
};

export type Site = typeof site;
