import { useEffect, type RefObject } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { heroDepth, heroScrollState } from "@/lib/motion";

/** Independent decorative layers never contain the booking controls. */
export function useHeroDepth(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>('.journey-stage');
    const photo = root?.querySelector<HTMLElement>('.hero-photo-depth');
    const headline = root?.querySelector<HTMLElement>('.hero-content h1');
    const train = root?.querySelector<HTMLElement>('.night-train-runner');
    if (!root || !stage || !photo || !headline || !train) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let controls: AnimationPlaybackControls[] = [];
    let frame = 0;
    let visible = true;
    function update() {
      frame = 0;
      if (preference.matches) return;
      const bounds = stage?.getBoundingClientRect();
      if (!bounds || !photo || !headline) return;
      const state = heroScrollState(-bounds.top, bounds.height);
      photo.style.transform = `translateY(${state.photoY}px)`;
      headline.style.transform = `scale(${state.headlineScale})`;
      headline.style.opacity = String(state.headlineOpacity);
    }
    function scroll() { if (!frame && visible) frame = requestAnimationFrame(update); }
    function configure() {
      controls.forEach(control => control.stop());
      controls = [];
      if (preference.matches) {
        photo?.style.removeProperty('transform');
        headline?.style.removeProperty('transform');
        headline?.style.removeProperty('opacity');
        return;
      }
      root?.querySelectorAll<HTMLElement>('.night-firefly').forEach((particle, index) => {
        controls.push(animate(particle, {
          x: [0, index % 2 ? -16 : 18, 0], y: [0, -24 - index % 5 * 4, 0],
          opacity: [0.04, 0.18, 0.04],
        }, { duration: heroDepth.particleDuration + index % 6 * 2, delay: -(index * 1.3), repeat: Infinity, ease: 'easeInOut' }));
      });
      if (train && stage) controls.push(animate(train, {
        x: [-280, -280, stage.clientWidth + 280, stage.clientWidth + 280],
        opacity: [0, 0.17, 0.17, 0],
      }, { duration: heroDepth.trainInterval, times: [0, 0.08, 0.48, 1], repeat: Infinity, ease: 'linear' }));
      update();
    }
    configure();
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      controls.forEach(control => visible && !document.hidden ? control.play() : control.pause());
      if (visible) scroll();
    });
    observer.observe(stage);
    const visibility = () => controls.forEach(control => document.hidden || !visible ? control.pause() : control.play());
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', configure);
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      controls.forEach(control => control.stop());
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', configure);
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', configure);
    };
  }, [ref]);
}

export function HeroAtmosphere() {
  return <div className="hero-atmosphere" aria-hidden="true">
    <div className="night-fireflies">{Array.from({ length: heroDepth.particles }, (_, index) => <span key={index} className="night-firefly" />)}</div>
    <div className="night-train-track">
      <div className="night-train-runner">
        <span className="night-train-trail" />
        <svg className="night-train-silhouette" viewBox="0 0 260 44" fill="none">
          <path d="M8 10h56v24H8zm62 0h56v24H70zm62 0h56v24h-56zm62 0h38l20 18v6h-58z" fill="currentColor" />
          <path d="M14 15h8m7 0h8m7 0h8m24 0h8m7 0h8m7 0h8m24 0h8m7 0h8m7 0h8m25 0h12" className="night-train-windows" strokeWidth="3" />
          <path d="M64 29h6m56 0h6m56 0h6" stroke="currentColor" strokeWidth="3" />
          {[18,54,80,116,142,178,207,235].map(x => <circle key={x} cx={x} cy="36" r="4" fill="currentColor" />)}
          <path d="M246 27h8" className="night-train-windows" strokeWidth="3" />
        </svg>
      </div>
    </div>
  </div>;
}