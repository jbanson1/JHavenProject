import Image from "next/image";

export type Scene = "living" | "bedroom" | "kitchen" | "exterior";

/**
 * Shows a real photo when `src` is set (see site.config.ts → photos), otherwise
 * a calm drawn interior so the layout looks finished before photos exist.
 */
export function Photo({
  src,
  alt,
  scene = "living",
  className = "",
  priority = false,
  sizes = "(max-width: 860px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  scene?: Scene;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`media ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      ) : (
        <>
          <SceneArt scene={scene} label={alt} />
          <span className="media__note">Photo coming soon</span>
        </>
      )}
    </div>
  );
}

function SceneArt({ scene, label }: { scene: Scene; label: string }) {
  const common = label
    ? ({ viewBox: "0 0 400 340", preserveAspectRatio: "xMidYMid slice", role: "img", "aria-label": label } as const)
    : ({ viewBox: "0 0 400 340", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true } as const);
  switch (scene) {
    case "bedroom":
      return (
        <svg {...common}>
          <rect width="400" height="340" fill="#ece3d6" />
          <rect y="236" width="400" height="104" fill="#d9c8b1" />
          {/* window */}
          <rect x="250" y="44" width="110" height="130" rx="4" fill="#f7f1e6" />
          <path d="M305 44v130M250 109h110" stroke="#e1d4c1" strokeWidth="4" />
          <rect x="240" y="38" width="20" height="150" rx="3" fill="#c9b79e" opacity=".7" />
          {/* headboard + bed */}
          <rect x="40" y="128" width="190" height="88" rx="10" fill="#2e5b4e" />
          <rect x="30" y="196" width="210" height="58" rx="10" fill="#fbf8f2" />
          <rect x="30" y="226" width="210" height="34" rx="8" fill="#b7825a" />
          <rect x="54" y="176" width="66" height="32" rx="10" fill="#fff" />
          <rect x="128" y="176" width="66" height="32" rx="10" fill="#fff" />
          <rect x="250" y="206" width="44" height="48" rx="4" fill="#c9b79e" />
          <circle cx="272" cy="186" r="14" fill="#f2e3c4" />
          <rect x="268" y="196" width="8" height="12" fill="#b7825a" />
          {/* art */}
          <rect x="96" y="66" width="80" height="48" rx="3" fill="#fbf8f2" />
          <path d="M104 106l20-22 16 14 12-10 16 18z" fill="#b7825a" opacity=".6" />
        </svg>
      );
    case "kitchen":
      return (
        <svg {...common}>
          <rect width="400" height="340" fill="#efe7db" />
          <rect y="262" width="400" height="78" fill="#d6c4ab" />
          {/* upper cabinets */}
          <rect x="30" y="50" width="200" height="70" rx="4" fill="#2e5b4e" />
          <path d="M80 50v70M130 50v70M180 50v70" stroke="#24493f" strokeWidth="3" />
          {/* window */}
          <rect x="262" y="48" width="104" height="110" rx="4" fill="#f9f4ea" />
          <path d="M314 48v110" stroke="#e3d7c5" strokeWidth="4" />
          {/* counter + base units */}
          <rect x="20" y="176" width="360" height="14" rx="3" fill="#fbf8f2" />
          <rect x="30" y="190" width="340" height="72" fill="#2e5b4e" />
          <path d="M115 190v72M200 190v72M285 190v72" stroke="#24493f" strokeWidth="3" />
          <path d="M98 214h-0M183 214h0" />
          {/* backsplash tiles */}
          <path d="M30 140h200M30 158h200" stroke="#e2d6c4" strokeWidth="2" />
          {/* items */}
          <rect x="60" y="150" width="22" height="26" rx="4" fill="#b7825a" />
          <circle cx="300" cy="162" r="14" fill="#7ea08f" />
          <rect x="296" y="164" width="8" height="12" fill="#b7825a" />
          <rect x="150" y="160" width="40" height="16" rx="8" fill="#c9b79e" />
          {/* stools */}
          <rect x="120" y="236" width="40" height="8" rx="4" fill="#b7825a" />
          <path d="M126 244l-6 40M154 244l6 40" stroke="#b7825a" strokeWidth="4" />
        </svg>
      );
    case "exterior":
      return (
        <svg {...common}>
          <rect width="400" height="340" fill="#e7eee9" />
          <circle cx="330" cy="70" r="30" fill="#f6e7c8" />
          <rect y="270" width="400" height="70" fill="#c9d6c6" />
          {/* terrace house */}
          <path d="M90 130 200 60l110 70z" fill="#b7825a" />
          <rect x="100" y="128" width="200" height="146" fill="#efe3d1" />
          <rect x="128" y="150" width="46" height="46" rx="3" fill="#2e5b4e" />
          <rect x="226" y="150" width="46" height="46" rx="3" fill="#2e5b4e" />
          <path d="M151 150v46M128 173h46M249 150v46M226 173h46" stroke="#efe3d1" strokeWidth="3" />
          <rect x="176" y="208" width="48" height="66" rx="24 24 0 0" fill="#2e5b4e" />
          <path d="M176 232a24 24 0 0 1 48 0" fill="none" />
          <circle cx="214" cy="244" r="3" fill="#f6e7c8" />
          <rect x="166" y="274" width="68" height="8" fill="#d9c8b1" />
          {/* plants */}
          <circle cx="70" cy="244" r="30" fill="#7ea08f" />
          <circle cx="330" cy="248" r="26" fill="#7ea08f" />
          <rect x="66" y="250" width="8" height="24" fill="#8a6a4e" />
          <rect x="326" y="252" width="8" height="22" fill="#8a6a4e" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect width="400" height="340" fill="#efe6d9" />
          <rect y="246" width="400" height="94" fill="#d8c6ae" />
          {/* window with light */}
          <rect x="236" y="36" width="130" height="150" rx="4" fill="#faf5ec" />
          <path d="M301 36v150M236 111h130" stroke="#e4d8c6" strokeWidth="4" />
          <path d="M236 186 180 246h130l56-60z" fill="#f6eedf" opacity=".7" />
          {/* art */}
          <rect x="70" y="58" width="96" height="64" rx="3" fill="#fbf8f2" />
          <circle cx="104" cy="86" r="14" fill="#b7825a" opacity=".7" />
          <path d="M78 114l30-20 20 12 30-22v30z" fill="#2e5b4e" opacity=".6" />
          {/* sofa */}
          <rect x="34" y="160" width="190" height="56" rx="16" fill="#2e5b4e" />
          <rect x="24" y="190" width="210" height="50" rx="14" fill="#356a5b" />
          <rect x="24" y="182" width="28" height="60" rx="12" fill="#2a5246" />
          <rect x="206" y="182" width="28" height="60" rx="12" fill="#2a5246" />
          <rect x="60" y="172" width="44" height="30" rx="8" fill="#b7825a" />
          <rect x="150" y="172" width="44" height="30" rx="8" fill="#f2e6d3" />
          <path d="M40 240v14M218 240v14" stroke="#8a6a4e" strokeWidth="5" strokeLinecap="round" />
          {/* rug + table */}
          <ellipse cx="200" cy="292" rx="150" ry="22" fill="#e9dccb" />
          <rect x="120" y="258" width="110" height="10" rx="5" fill="#b7825a" />
          <path d="M132 268v18M218 268v18" stroke="#8a6a4e" strokeWidth="4" />
          {/* plant + lamp */}
          <rect x="300" y="210" width="40" height="40" rx="6" fill="#c9b79e" />
          <circle cx="320" cy="186" r="26" fill="#7ea08f" />
          <circle cx="306" cy="172" r="14" fill="#6c917f" />
          <path d="M268 250V150" stroke="#8a6a4e" strokeWidth="3" />
          <path d="M252 150h32l-8-22h-16z" fill="#f2e3c4" />
        </svg>
      );
  }
}
