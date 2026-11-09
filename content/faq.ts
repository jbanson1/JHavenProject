/**
 * Landlord FAQ. Draft answers written for the demo: have them checked against
 * the real agreement terms (and by a solicitor) before the site goes live.
 */
export type Faq = { q: string; a: string };

export const landlordFaqs: Faq[] = [
  {
    q: "What is rent-to-rent?",
    a: "We rent your property from you on a fixed-term company let, usually 3 to 5 years. We pay you an agreed rent every month, then furnish the home and let it to vetted guests for short stays. You get a reliable income without the day-to-day work of being a landlord.",
  },
  {
    q: "Is my rent really guaranteed?",
    a: "Yes. Your rent is set out in the agreement and paid on the same date every month, whether the property is booked or not. We aim for 60–80% occupancy, but that is our risk to carry, not yours.",
  },
  {
    q: "Is this legal? Do I need permission?",
    a: "Rent-to-rent is legal in the UK when it is set up properly. Before we sign, we check that short-term letting is allowed for your property. That means your mortgage lender's consent, the freeholder or lease terms for flats, and local rules (in London, short lets over 90 nights a year need planning permission). We help you get anything that is needed, in writing.",
  },
  {
    q: "Who pays the bills and council tax?",
    a: "We do. Utilities, council tax, broadband, TV licence and cleaning are all paid by us for the length of the agreement.",
  },
  {
    q: "Who looks after maintenance and repairs?",
    a: "We handle day-to-day maintenance and minor repairs at our cost, and we inspect the property regularly. Structural and major items (roof, boiler replacement and so on) usually stay with the owner, as in a normal tenancy, and are agreed up front in the contract.",
  },
  {
    q: "What about damage and insurance?",
    a: "Every guest is ID-checked and booked through platforms with host protection, and we hold our own public liability and contents cover. You keep your buildings insurance; we make sure your insurer is aware of the arrangement.",
  },
  {
    q: "Will you change my property?",
    a: "We refurbish and furnish at our own expense to make the home guest-ready: decoration, furniture, linen and smart touches. Nothing structural is changed without your written agreement, and the property is handed back in the same or better condition.",
  },
  {
    q: "How do you vet guests?",
    a: "Guests are ID-verified, we check reviews from previous stays, and we set clear house rules: no parties, quiet hours and a minimum stay. Smart locks and noise monitors (no cameras inside) help us spot problems early.",
  },
  {
    q: "How long is the agreement, and what happens at the end?",
    a: "Most agreements run 3 to 5 years, with break clauses we agree together. At the end you can renew, or we hand the property back in the condition set out in the inventory.",
  },
  {
    q: "What does it cost me?",
    a: "Nothing. There are no management fees, no letting fees and no void periods. You receive your agreed rent in full every month.",
  },
];
