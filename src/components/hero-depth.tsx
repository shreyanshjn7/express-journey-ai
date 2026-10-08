import { useEffect, type RefObject } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { heroDepth, heroScrollState, motionDuration } from "@/lib/motion";

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
    const mobile = window.matchMedia('(max-width: 760px)');
    let controls: AnimationPlaybackControls[] = [];
    let frame = 0;
    let visible = false;
    let ready = false;
    let idleTimer = 0;
    const particles = [...root.querySelectorAll<HTMLElement>('.night-firefly')];
    function clearHints() {
      photo?.style.removeProperty('will-change'); headline?.style.removeProperty('will-change');
      train?.style.removeProperty('will-change'); particles.forEach(particle => particle.style.removeProperty('will-change'));
    }
    function update() {
      frame = 0;
      if (preference.matches || mobile.matches || !visible || document.hidden) return;
      const bounds = stage?.getBoundingClientRect();
      if (!bounds || !photo || !headline) return;
      const state = heroScrollState(-bounds.top, bounds.height);
      photo.style.willChange = 'transform'; headline.style.willChange = 'transform, opacity';
      // Keep scroll depth inside the photo's six-percent overscan at rest/zoom end.
      photo.style.transform = `translateY(${Math.min(state.photoY, bounds.height * 0.05)}px)`;
      headline.style.transform = `scale(${state.headlineScale})`;
      headline.style.opacity = String(state.headlineOpacity);
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => { photo.style.removeProperty('will-change'); headline.style.removeProperty('will-change'); }, 140);
    }
    function scroll() { if (!frame && visible && !mobile.matches && !preference.matches && !document.hidden) frame = requestAnimationFrame(update); }
    function sync() {
      const playing = visible && !document.hidden && !preference.matches;
      root?.setAttribute('data-decoration-state', !ready ? 'waiting' : playing ? 'playing' : 'paused');
      controls.forEach(control => playing ? control.play() : control.pause());
      if (!playing) clearHints();
      else if (ready) {
        if (train) train.style.willChange = 'transform, opacity';
        if (!mobile.matches) particles.forEach(particle => particle.style.willChange = 'transform, opacity');
      }
    }
    function configure() {
      controls.forEach(control => control.stop());
      controls = [];
      clearHints();
      particles.forEach(particle => { particle.style.opacity = '0'; });
      if (train) train.style.opacity = '0';
      if (preference.matches || mobile.matches) {
        photo?.style.removeProperty('transform');
        headline?.style.removeProperty('transform');
        headline?.style.removeProperty('opacity');
      }
      if (!ready || preference.matches) { sync(); return; }
      if (!mobile.matches) particles.forEach((particle, index) => {
        controls.push(animate(particle, {
          x: [0, index % 2 ? -16 : 18, 0], y: [0, -24 - index % 5 * 4, 0],
          opacity: [0.04, 0.18, 0.04],
        }, { duration: heroDepth.particleDuration + motionDuration(index % 6 * 2), delay: -(index * 1.3), repeat: Infinity, ease: 'easeInOut' }));
      });
      if (train && stage) controls.push(animate(train, {
        x: [-280, -280, stage.clientWidth + 280, stage.clientWidth + 280],
        opacity: [0, 0.17, 0.17, 0],
      }, { duration: heroDepth.trainInterval, times: [0, 0.08, 0.48, 1], repeat: Infinity, ease: 'linear' }));
      sync(); scroll();
    }
    // Both the image and primary UI must be ready before decorative work starts.
    function checkReady() {
      if (ready || !root?.querySelector('.hero-loaded') || root.dataset['homeEntrance'] !== 'complete') return;
      ready = true; configure();
    }
    const loadObserver = new MutationObserver(checkReady);
    loadObserver.observe(root, { attributes: true, subtree: true, attributeFilter: ['class', 'data-home-entrance'] });
    checkReady();
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
      if (visible) scroll();
    });
    observer.observe(stage);
    const visibility = () => { sync(); if (!document.hidden) scroll(); };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', configure);
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', configure);
    mobile.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer); clearHints(); loadObserver.disconnect();
      controls.forEach(control => control.stop());
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', configure);
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', configure);
      mobile.removeEventListener('change', configure);
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