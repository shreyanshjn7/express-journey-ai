<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the booking experience on the index route with local form state; this project currently provides a UI preview, not live train inventory or AI services.
- Define palette, typography and control shapes in src/styles.css and use shared UI primitives to keep presentation consistent.
- Keep route inputs and the search action inside one booking form styled as a unified console, so submission and visual grouping stay aligned.
- Render the header wordmark as live typography using the shared display-font token, so it stays matched to the page headings at every screen size.
- Use a viewport-height flex layout with a growing main stage and bounded centered content; this keeps the footer on screen without clipping the booking controls on smaller displays.
- Serve the background through an AVIF/WebP picture with intrinsic dimensions and a same-size blurred loading layer; this reduces transfer size without shifting the booking layout.
- Keep swap-font definitions and metric-adjusted local fallback faces in the global typography system; this preserves shared heading and control geometry during font loading.
- Theme is hybrid: `:root` holds light content tokens, `.dark`/`.hero-dark` hold dark tokens; the header + booking stage live inside `.hero-dark` so they stay dark regardless of the user's theme toggle. Why: one token set themes both zones.
- Post-search screens (/trains, /seats, /passengers, /payment) carry trip state in validated URL search params and share BookingShell for progress + sticky mobile fare bar. Why: deep-linkable steps without a backend.
- Keep shared motion values in src/lib/motion.ts and mount MotionSystem once at the root; delegated Framer Motion covers dynamic controls and portals without extra layout wrappers, and exports identical timing tokens for decorative CSS.
- Import Lenis only in the client effect and preserve native touch/nested picker scrolling; stop it for dialogs and reduced-motion preferences so form and accessibility behavior stay intact.
- Never animate a transform on an ancestor of fixed booking actions or station sheets; transform containing blocks would displace pinned mobile controls.
- Keep home first-load orchestration in useHomeEntrance with sessionStorage gating and shared motion tokens; exclude home entrances from the delegated scanner, and move only an independent landing surface on phones so pinned actions and pickers retain viewport positioning.
- Keep scroll depth on a separate photo wrapper and the headline only; decorative particles/train are inert clipped layers, with shared motion tokens and reduced-motion/offscreen pausing so booking controls remain viewport-safe.
- Keep search-specific motion in search-motion with shared timing tokens; mark owned controls to exclude delegated transforms, and compress only independent surfaces on phones so fixed actions and station sheets stay viewport-bound.
