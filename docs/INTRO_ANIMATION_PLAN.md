# Intro Animation Plan

## 1. Final Animation Concept

Name: `Only for You: Paper Theater Intro`

Reading this as a short theatrical first-load transition for a lightweight language-practice app, with a quiet Soviet fairy-tale paper-theater language, leaning toward native CSS material design plus a focused Anime.js v4 timeline.

Design dials:

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 3`

The intro is intentionally decorative, not a technical loading state. It should feel like a small paper curtain opening before the study table appears.

Visual language:

- Full-screen aged cream/yellow paper overlay.
- Pale rose center glow.
- Soft edge vignette.
- Subtle static film grain.
- Thin ornamental paper-window frame.
- A tiny warm star at center.
- A few hand-drawn dust/star particles drifting slowly.
- Gentle layered paper parallax, only a few pixels.
- The message `Only for you` revealed with a soft writing or ink-mask feeling.

Avoid:

- Loading spinners.
- Progress bars.
- Neon glow.
- Glassmorphism.
- Confetti.
- Arcade particles.
- Bouncy easing.
- Any specific copyrighted fairy-tale character or film reference.

## 2. Duration And Timeline Breakdown

Recommended total duration: `2100ms`

Acceptable range: `1800ms` to `2400ms`

Timeline:

| Time | Action | Duration | Notes |
|---:|---|---:|---|
| `0ms` | Overlay appears already covering the app | `0ms` | Rendered opaque immediately to avoid a flash of normal UI. |
| `80ms` | Center star/glow blooms in | `300ms` | Scale from `0.72` to `1`, opacity from `0` to `1`. |
| `220ms` | Paper layers settle | `650ms` | Very small `translateY` and `translateX`, no more than `6px`. |
| `360ms` | Ornamental frame draws/fades in | `520ms` | Use SVG stroke drawing if implemented as SVG, or opacity plus scale if CSS frame. |
| `680ms` | Text `Only for you` writes in | `720ms` | Prefer soft mask reveal over literal typewriter. |
| `920ms` | Dust/star particles drift | `900ms` | Subtle staggered opacity and transform. |
| `1600ms` | Text holds briefly | `260ms` | Let the message register. |
| `1840ms` | Overlay fades and lifts away | `360ms` | Opacity to `0`, slight `translateY(-8px)`. |
| `2200ms` | Intro unmounts | `0ms` | Normal app is fully interactive. |

Easing:

- Entry: `outCubic` or `outQuad`.
- Text reveal: `inOutSine` or `outCubic`.
- Exit: `inOutQuad`.
- Avoid elastic, bounce, and springy effects.

## 3. Components To Add

Add one isolated component:

```txt
src/components/IntroOverlay.tsx
```

Component responsibilities:

- Render the full-screen overlay.
- Own all refs used by Anime.js.
- Run the intro timeline on mount.
- Call `onComplete` when finished.
- Provide a minimal `Skip` button.
- Respect reduced motion.
- Clean up Anime.js effects on unmount.

Suggested props:

```ts
type IntroOverlayProps = {
  onComplete: () => void;
};
```

Optional helper:

```txt
src/hooks/usePrefersReducedMotion.ts
```

This hook is optional. If the app already has a reduced-motion helper, use the existing one. Otherwise, keep the reduced-motion check inside `IntroOverlay.tsx` to avoid creating unnecessary abstraction.

Integration point:

```txt
src/App.tsx
```

Only add intro visibility state and render `<IntroOverlay onComplete={...} />`. Do not change sentence selection, filtering, reveal behavior, answer state, or next-card logic.

## 4. CSS Classes To Add

Add CSS to `src/styles.css` unless the project already has a better component stylesheet pattern.

Core classes:

```css
.intro-overlay
.intro-overlay::before
.intro-overlay::after
.intro-theater
.intro-paper-layer
.intro-paper-layer--back
.intro-paper-layer--front
.intro-frame
.intro-frame__line
.intro-star
.intro-message
.intro-message__sr
.intro-message__text
.intro-particles
.intro-particle
.intro-skip
.app-shell--intro-active
```

Class roles:

- `.intro-overlay`: fixed full-screen layer, high z-index, cream paper background.
- `.intro-overlay::before`: subtle vignette.
- `.intro-overlay::after`: film grain using a lightweight CSS radial/noise texture.
- `.intro-theater`: centered composition wrapper.
- `.intro-paper-layer`: background paper cut-out layers with tiny parallax movement.
- `.intro-frame`: ornamental window or thin frame.
- `.intro-star`: center glow/star element.
- `.intro-message`: text container.
- `.intro-message__sr`: screen-reader-only full message.
- `.intro-message__text`: animated visual duplicate, `aria-hidden="true"`.
- `.intro-particles`: absolute layer for small stars and dust.
- `.intro-particle`: individual dust/star marks.
- `.intro-skip`: small skip control in a quiet corner.
- `.app-shell--intro-active`: optional app wrapper state if the app should be inert while intro runs.

CSS material notes:

- Use gradients and pseudo-elements for paper texture.
- Keep grain static, not animated.
- Use `pointer-events: auto` on overlay and `pointer-events: none` on decorative layers.
- Reserve `z-index` for this overlay explicitly, for example `z-index: 100`.
- Use `min-height: 100dvh`, not `100vh`.

Suggested palette tokens:

```css
--intro-paper: #f0e9bf;
--intro-paper-deep: #d8c98f;
--intro-rose: #efb1aa;
--intro-rose-deep: #c34040;
--intro-ink: #3f3129;
--intro-green: #5d6f4e;
--intro-vignette: rgba(63, 49, 41, 0.22);
```

## 5. Anime.js APIs To Use

Use Anime.js v4 imports already aligned with the existing animation setup:

```ts
import { createTimeline, stagger } from "animejs";
```

Optional:

```ts
import { createScope } from "animejs";
```

Recommended approach:

- Use React refs for root, frame, star, message, particles, and paper layers.
- Use `createTimeline()` for the full sequence.
- Use `stagger()` for particle timing.
- Use `.add()` timeline steps with absolute offsets for precise choreography.
- Store the timeline in a ref so `Skip` can cancel or complete it.
- Cleanup on unmount with timeline `revert()` or `cancel()`, depending on the existing Anime.js usage in the codebase.

Planned refs:

```ts
const rootRef = useRef<HTMLDivElement | null>(null);
const theaterRef = useRef<HTMLDivElement | null>(null);
const starRef = useRef<HTMLDivElement | null>(null);
const frameRef = useRef<HTMLDivElement | null>(null);
const messageRef = useRef<HTMLSpanElement | null>(null);
const particleRefs = useRef<HTMLSpanElement[]>([]);
const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);
```

Animation targets:

- `rootRef.current`
- `theaterRef.current`
- `starRef.current`
- `frameRef.current`
- `messageRef.current`
- `particleRefs.current`

Text reveal:

- Prefer animating `clipPath`, `maskPosition`, or `opacity` plus a small `translateY`.
- The best fit is a soft mask reveal: text feels written by light or ink without mechanical typing.
- Do not update text content character by character. That is slower, more fragile for screen readers, and too literal for this mood.

## 6. Accessibility And Reduced Motion Behavior

Accessibility requirements:

- The overlay should not trap focus unless it contains a focusable `Skip` button.
- `Skip` must be keyboard reachable.
- The visual animated text should be `aria-hidden="true"`.
- Include an accessible text node such as:

```tsx
<span className="intro-message__sr">Only for you</span>
```

- If the overlay blocks the app, set the app wrapper to `aria-hidden` or `inert` only while intro is visible. Prefer avoiding complex focus management by keeping the intro short and providing skip.
- When the intro completes, focus should remain natural. Do not force focus into the app unless testing shows keyboard users land somewhere confusing.

Reduced motion:

- Detect `prefers-reduced-motion: reduce`.
- If reduced motion is enabled, use one of these behaviors:
  - Show `Only for you` statically for `600ms` to `800ms`, then remove the overlay.
  - Or skip the overlay entirely after setting completion state.

Recommended reduced-motion default:

- Show the static message for about `700ms`.

Reason:

- It preserves the personal greeting without forcing motion.
- It avoids a surprising flash from immediate removal.

CSS support:

```css
@media (prefers-reduced-motion: reduce) {
  .intro-overlay *,
  .intro-overlay::before,
  .intro-overlay::after {
    animation: none !important;
    transition: none !important;
  }
}
```

## 7. State Management Approach

Recommended run behavior: `B. only once per browser session using sessionStorage`

Reason:

- The intro is theatrical, not required for loading.
- Seeing it on every route refresh during the same browsing session would become annoying.
- Session-only storage keeps the moment special without making it disappear forever.
- It still appears again in a future browser session, which matches the personal invitation mood.

State plan:

```ts
const INTRO_STORAGE_KEY = "russian-word-roulette:intro-seen";
const [showIntro, setShowIntro] = useState(() => {
  return sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
});
```

Completion handler:

```ts
function handleIntroComplete() {
  sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
  setShowIntro(false);
}
```

Implementation detail:

- Guard `sessionStorage` access for environments where `window` is unavailable, even though this is a Vite client app.
- If storage throws, fall back to showing the intro once for the current React mount.
- Do not store anything in localStorage. This should not be a permanent preference.

Skip behavior:

- `Skip` calls the same completion handler.
- If a timeline is running, cancel or complete it first to avoid calling `onComplete` twice.
- Use a small `hasCompletedRef` guard.

## 8. Exact Implementation Steps

1. Confirm Anime.js is already installed in `package.json`.
2. Add `src/components/IntroOverlay.tsx`.
3. In `IntroOverlay.tsx`, create refs for overlay, theater, star, frame, text, paper layers, and particles.
4. Render the overlay with the exact visible message `Only for you`.
5. Add a screen-reader-only copy of the message and mark the animated visual text as `aria-hidden`.
6. Add a minimal `Skip` button, positioned quietly in the lower or upper right.
7. In `useEffect`, check `prefers-reduced-motion`.
8. For reduced motion, show static overlay briefly, then call `onComplete`.
9. For normal motion, build a `createTimeline()` sequence:
   - Set initial opacity and transforms.
   - Bloom the center star.
   - Fade or draw the frame.
   - Reveal the text with a soft mask.
   - Drift particles with `stagger()`.
   - Fade and lift the overlay out.
10. Store the timeline in a ref.
11. Add cleanup to cancel or revert the timeline on unmount.
12. Add completion guard so skip and timeline completion cannot both update state twice.
13. Add CSS classes to `src/styles.css`.
14. In `src/App.tsx`, add `showIntro` state initialized from `sessionStorage`.
15. Render `<IntroOverlay onComplete={handleIntroComplete} />` above the existing app when `showIntro` is true.
16. Keep the app logic unchanged.
17. Keep sentence randomizer behavior unchanged.
18. Run `npm.cmd run build`.
19. Manually check first page load, reload within same browser session, skip behavior, reduced motion, mobile viewport, and keyboard access.

## 9. Risks To Avoid

- Do not make it feel like a real loader. No spinner, percentage, progress bar, or fake network language.
- Do not make the intro longer than `2400ms`.
- Do not run the full animation on every reload in the same browser session.
- Do not animate hundreds of particles. Use about `8` to `14`.
- Do not use animated grain. Static grain is enough and cheaper.
- Do not animate layout-heavy properties such as `top`, `left`, `width`, or `height`.
- Do not let the overlay cause layout shift in the app beneath it.
- Do not let `Skip` look like a primary CTA.
- Do not trap keyboard users in the overlay.
- Do not make screen readers announce character-by-character text changes.
- Do not introduce a UI library.
- Do not change any sentence, deck, filter, reveal-card, or answer behavior.
- Do not use a copyrighted visual reference as a direct model.
- Do not overuse glow. The rose center glow should feel like candlelight on paper, not neon.
- Do not let the paper-theater intro visually fight the current study-hall interface. It should feel like the door into the same world.

## Recommended Acceptance Criteria

- First full page load shows the intro once per browser session.
- The visible message is exactly `Only for you`.
- The normal app is visible and usable after roughly `2.1s`.
- `Skip` dismisses the intro immediately.
- Reduced motion users get a static, brief message or no motion.
- Build passes.
- No app behavior changes outside the intro overlay.
