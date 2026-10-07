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
- Define the cinematic palette, typography, control shapes, and motion in src/styles.css and use shared UI primitives for interactions to keep presentation consistent.
- Keep route inputs and the search action inside one booking form styled as a unified console, so submission and visual grouping stay aligned.
- Render the header wordmark as live typography using the shared display-font token, so it stays matched to the page headings at every screen size.
- Use a viewport-height flex layout with a growing main stage and bounded centered content; this keeps the footer on screen without clipping the booking controls on smaller displays.
- Serve the background through an AVIF/WebP picture with intrinsic dimensions and a same-size blurred loading layer; this reduces transfer size without shifting the booking layout.
- Keep swap-font definitions and metric-adjusted local fallback faces in the global typography system; this preserves shared heading and control geometry during font loading.
- Theme is hybrid: `:root` holds light content tokens, `.dark`/`.hero-dark` hold dark tokens; the header + booking stage live inside `.hero-dark` so they stay dark regardless of the user's theme toggle. Why: one token set themes both zones.
