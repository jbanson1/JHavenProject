/** Small inline line icons (stroke = currentColor). */
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const IconCheck = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>);
export const IconPound = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M17 20H7c2-1.5 2.5-3.5 2.5-6V8.5A3.5 3.5 0 0 1 16 7" /><path d="M6.5 13h8" /></svg>);
export const IconCalendar = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="m9 15 2 2 4-4" /></svg>);
export const IconTools = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></svg>);
export const IconShield = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></svg>);
export const IconKey = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3M14.5 8.5l2 2" /></svg>);
export const IconPhone = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z" /></svg>);
export const IconMail = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>);
export const IconClock = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
export const IconPin = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>);
export const IconHome = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 11 12 4l8 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5h4v5" /></svg>);
export const IconHandshake = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="m3 11 4-4 4 2 3-2 7 5" /><path d="m7 7-4 4 6 6c.8.8 2 .8 2.8 0l5.7-5.7" /><path d="m10 14 2 2M12.5 11.5l2 2" /></svg>);
export const IconSparkle = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>);
export const IconChat = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.4A7.5 7.5 0 1 1 20 12z" /></svg>);
export const IconMenu = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconClose = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconArrow = (p: P) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

/** The wordmark symbol: a simple roof over a doorway. */
export const Mark = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <rect width="32" height="32" rx="9" fill="var(--accent)" />
    <path d="M8 15.5 16 9l8 6.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 14v9h11v-9" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14.5 23v-4.5a1.5 1.5 0 0 1 3 0V23" fill="none" stroke="var(--clay)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
