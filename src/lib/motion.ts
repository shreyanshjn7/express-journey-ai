/** Single source of truth: seconds for Framer Motion/Lenis, pixels for travel. */
export const motionTokens = {
  easing: {
    entrance: [0.16, 1, 0.3, 1] as const,
    transition: [0.76, 0, 0.24, 1] as const,
  },
  spring: {
    soft: { type: "spring" as const, stiffness: 120, damping: 18 },
    snappy: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  duration: { micro: 0.15, standard: 0.35, entrance: 0.7, hero: 1.1 },
  stagger: 0.07,
  distance: { entrance: 20, sheet: 16 },
  scale: { hover: 1.01, press: 0.97, resting: 1 },
} as const;

export const entranceFrames = { opacity: [0, 1], y: [motionTokens.distance.entrance, 0] };
export const sheetFrames = { opacity: [0, 1], y: [motionTokens.distance.sheet, 0] };

/** Home-only choreography: the photo continues after the two-second UI reveal. */
export const homeEntrance = {
  sessionKey: "rd-home-entrance-seen",
  zoom: { from: 1.08, to: 1, duration: 8 },
  header: { delay: 0.08, distance: -16 },
  words: { delay: 0.25, stagger: 0.08, duration: 0.7 },
  underline: { delay: 1.11, duration: 0.35 },
  subhead: { delay: 0.65, distance: 20 },
  card: { delay: 0.85, distance: 40, scale: 0.97, duration: 0.7 },
  routes: { delay: 1.2, stagger: 0.08, duration: 0.55 },
  marquee: { delay: 1.72, duration: 0.35 },
} as const;

export function claimHomeEntrance(storage: Pick<Storage, "getItem" | "setItem">, reducedMotion: boolean) {
  try {
    if (storage.getItem(homeEntrance.sessionKey)) return false;
    storage.setItem(homeEntrance.sessionKey, "1");
  } catch { /* In-memory mount still works when browser storage is unavailable. */ }
  return !reducedMotion;
}

export function expoEase(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Export the same values to legacy decorative CSS, not a second token set. */
export const motionCssVariables = {
  "--motion-ease-entrance": `cubic-bezier(${motionTokens.easing.entrance.join(",")})`,
  "--motion-ease-transition": `cubic-bezier(${motionTokens.easing.transition.join(",")})`,
  "--motion-micro": `${motionTokens.duration.micro}s`,
  "--motion-standard": `${motionTokens.duration.standard}s`,
  "--motion-entrance": `${motionTokens.duration.entrance}s`,
  "--motion-hero": `${motionTokens.duration.hero}s`,
} as const;