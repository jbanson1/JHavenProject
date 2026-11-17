/**
 * Home-page showcase content.
 *
 * The featured property is hidden while it is null, so nothing appears until
 * there is a real home with real photos to show. Fill it in like this:
 *
 * export const featuredProperty: FeaturedProperty | null = {
 *   name: "Two-bedroom flat",
 *   area: "Stratford, E15",
 *   summary: "Refurbished and furnished by us, and booked by contractors and business travellers.",
 *   facts: ["2 bedrooms", "Sleeps 4", "Self check-in", "Fast Wi-Fi and a desk"],
 *   photos: ["/images/home-1.jpg", "/images/home-2.jpg", "/images/home-3.jpg", "/images/home-4.jpg", "/images/home-5.jpg"],
 *   travelTimes: [{ place: "Liverpool Street", time: "8 min" }, { place: "Canary Wharf", time: "10 min" }],
 *   bookingUrl: "https://www.airbnb.co.uk/rooms/…",
 * };
 */

export type FeaturedProperty = {
  name: string;
  area: string;
  summary: string;
  facts: string[];
  /** Paths in /public/images. The first is shown large; up to four more beside it. */
  photos: string[];
  /** Approximate journey times by public transport, shown as one line. Check before publishing. */
  travelTimes: { place: string; time: string }[];
  /** Airbnb or other booking link for this home. "" hides the button. */
  bookingUrl: string;
};

export const featuredProperty: FeaturedProperty | null = null;

/** Who stays in our homes (shown to landlords as reassurance). */
export const guestTypes = [
  { title: "Business travellers", body: "Consultants and staff on placement who need a quiet place to work and rest during the week." },
  { title: "Contractors", body: "Teams on site for a few weeks or months who want a proper kitchen rather than a hotel room." },
  { title: "Relocations", body: "People moving to London for work, staying while they find somewhere long term." },
  { title: "Families", body: "Visiting relatives or families between homes, who need more space than a hotel offers." },
];
