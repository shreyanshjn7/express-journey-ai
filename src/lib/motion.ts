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

export const searchMotion = {
  suggestionStagger: 0.03,
  magneticLimit: 8,
  swapRotation: 180,
  shake: { x: [0, -6, 6, -6, 6, -6, 6, 0], duration: 0.3 },
  shineInterval: 5,
  submitPause: 0.5,
} as const;

export const routeMotion = { rise: 20, lift: -4, stagger: 0.07, flight: 0.7, glow: 0.7, train: 1.4 } as const;

export const bookingMotion = { cardStagger: 0.06, chipStagger: 0.06, count: 0.7, expand: 0.35, loadingPreview: 0.7, rail: 1.1, morph: 0.7 } as const;

export function bookingProgress(step: number) { return Math.max(0, Math.min(3, step)) / 3; }

export const ticketMotion = {
  rise: 24, tilt: -3, entrance: 0.7, tearDelay: 0.45, tear: 0.35,
  checkDelay: 0.65, check: 0.35, sparks: 1.5,
  qrDelay: 0.9, qr: 0.7, detailsDelay: 0.8, detailStagger: 0.08,
} as const;

export const marqueeMotion = { speed: 36, settle: 0.35, boostDecay: 0.55, maxBoost: 3, maxSkew: 2.5, hoverScale: 1.08, flight: 0.7 } as const;

export function marqueeScrollImpulse(velocity: number) {
  const strength = Math.min(1, Math.abs(velocity) / 1600);
  return { boost: strength * marqueeMotion.maxBoost, skew: Math.sign(velocity) * strength * marqueeMotion.maxSkew };
}

export function easeMarqueeSpeed(current: number, target: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-Math.max(0, delta) / marqueeMotion.settle));
}

export function magneticOffset(position: number, size: number) {
  if (size <= 0) return 0;
  return Math.max(-searchMotion.magneticLimit, Math.min(searchMotion.magneticLimit, (position / size - 0.5) * searchMotion.magneticLimit * 2));
}

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

export const heroDepth = {
  photoSpeed: 0.3,
  particles: 16,
  particleDuration: 18,
  trainInterval: 25,
  headlineScale: 0.94,
  headlineOpacity: 0.55,
} as const;

export function heroScrollState(distance: number, height: number) {
  const travel = Math.max(0, Math.min(distance, height));
  const progress = height > 0 ? travel / height : 0;
  return {
    photoY: travel * (1 - heroDepth.photoSpeed),
    headlineScale: 1 - progress * (1 - heroDepth.headlineScale),
    headlineOpacity: 1 - progress * (1 - heroDepth.headlineOpacity),
  };
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