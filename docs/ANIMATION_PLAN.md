# Anime.js Animation Plan

## Design Read

Reading this as a targeted motion layer for a static language-practice app, for self-study learners, with a calm vintage paper study-hall language, leaning toward Anime.js v4 plus native React and CSS.

The goal is not spectacle. Motion should clarify the learning sequence: read, type, reveal, compare, continue.

## Current App Snapshot

- Stack: Vite, React 19, TypeScript, plain CSS.
- Animation library: Anime.js is not installed yet.
- Main files:
  - `src/App.tsx`
  - `src/components/PracticeCard.tsx`
  - `src/components/DeckProgress.tsx`
  - `src/components/FilterBar.tsx`
  - `src/styles.css`
- Main selectors available now:
  - `.app-shell`
  - `.study-header`
  - `.title-lockup`
  - `.deck-progress-shell`
  - `.filter-bar`
  - `.filter-bar__control`
  - `.practice-card`
  - `.practice-card__grid`
  - `.source-sentence`
  - `.answer-field textarea`
  - `.target-ticket`
  - `.target-ticket__surface`
  - `.target-sentence`
  - `.practice-card__actions`
  - `.paper-button`

## Motion Principles

- Use motion to show state changes, not to decorate.
- Prefer opacity and transform. Avoid animating width, height, top, left, or grid values.
- Keep durations slow enough to feel paper-like, but short enough that practice does not feel delayed.
- Use subtle vertical movement, tiny scale changes, soft opacity, and very light blur only when useful.
- Avoid bounce, elastic, spinning, arcade motion, random motion, and character-by-character text animation.
- Respect `prefers-reduced-motion`.
- Do not change sentence deck, randomizer, reveal, filter, or reset logic.

## Dependency Plan

Anime.js is not currently in `package.json`.

Implementation should add:

```bash
npm install animejs
```

Recommended imports:

```ts
import { animate, createScope, createTimeline } from "animejs";
```

Use `createScope` for React cleanup, scoped selectors, and media-query control. Use `animate` for one-off state transitions. Use `createTimeline` only for the initial page entrance.

## Reduced Motion Strategy

Create one small helper before implementing animations:

- File option: `src/hooks/usePrefersReducedMotion.ts`
- Behavior:
  - Read `window.matchMedia("(prefers-reduced-motion: reduce)")`.
  - Return `true` when reduced motion is requested.
  - Subscribe to media query changes.

Implementation rule:

- If reduced motion is true, skip Anime.js calls.
- The UI should update instantly with no opacity hidden state.
- Keep normal focus styles intact.

Alternative:

- Use Anime.js `createScope({ root, mediaQueries })` if implementation wants all motion decisions inside one scope.
- Still keep a React helper if animation triggers are split across components.

## Animation 1: Initial Page Entrance

Trigger:

- First render after the app mounts.

Target element:

- `.app-shell`
- `.study-header`
- `.filter-bar`
- `.practice-card`

Anime.js API:

- `createScope` in `App.tsx` with a root ref on `.app-shell`.
- `createTimeline` for a controlled sequence.

Suggested motion:

```ts
const timeline = createTimeline({
  defaults: {
    duration: 520,
    ease: "outCubic",
  },
});

timeline
  .add(".app-shell", { opacity: [0, 1], translateY: [10, 0] })
  .add(".study-header", { opacity: [0, 1], translateY: [8, 0] }, "-=340")
  .add(".filter-bar", { opacity: [0, 1], translateY: [6, 0] }, "-=300")
  .add(".practice-card", { opacity: [0, 1], translateY: [8, 0] }, "-=260");
```

Duration:

- Total: 700ms to 900ms.
- Each element: 420ms to 560ms.

Easing:

- `outCubic` or `outSine`.

Why it improves UX:

- It lets the page settle like a paper sheet placed on a desk.
- It establishes the practice card as the final focus without forcing attention.

What to avoid:

- Do not stagger every label or every select.
- Do not animate large scale jumps.
- Do not animate background gradients.
- Do not delay interactivity.

## Animation 2: Source Sentence Change On Next

Trigger:

- `sentence?.id` changes after `Next` is clicked.
- Also runs after filters create a new deck, because the visible sentence changes.

Target element:

- `.source-sentence`
- Optional: `.ornamental-divider` under the source sentence.

Anime.js API:

- `animate` inside `PracticeCard.tsx`.
- Use refs for the source sentence and divider, or use `createScope` scoped to the card.

Suggested motion:

```ts
animate(sourceSentenceRef.current, {
  opacity: [0, 1],
  translateY: [10, 0],
  filter: ["blur(2px)", "blur(0px)"],
  duration: 460,
  ease: "outCubic",
});
```

Optional divider motion:

```ts
animate(dividerRef.current, {
  opacity: [0.35, 1],
  scaleX: [0.96, 1],
  duration: 420,
  ease: "outSine",
});
```

Duration:

- Source sentence: 420ms to 520ms.
- Divider: 360ms to 440ms.

Easing:

- `outCubic` for the sentence.
- `outSine` for the divider.

Why it improves UX:

- The user sees that a new study card has arrived.
- It avoids the abrupt hard swap that can feel like a page glitch.

What to avoid:

- Do not animate the old sentence out before calling `nextSentence`, because that would require delaying deck logic.
- Do not split text into letters or words.
- Do not use large horizontal movement.
- Do not animate font size or line height.

## Animation 3: Target Ticket Reveal

Trigger:

- `isRevealed` changes from false to true.

Target element:

- `.target-ticket__surface`
- `.target-sentence`
- `.study-note`
- Optional: `.target-ticket .ornamental-divider`

Anime.js API:

- `animate` or a small `createTimeline` inside `TargetTicketCard` or `PracticeCard`.
- Prefer a ref on the ticket root.

Suggested motion:

```ts
const revealTimeline = createTimeline({
  defaults: { ease: "outCubic" },
});

revealTimeline
  .add(ticketSurfaceRef.current, {
    opacity: [0.88, 1],
    translateY: [6, 0],
    scale: [0.992, 1],
    duration: 360,
  })
  .add(targetSentenceRef.current, {
    opacity: [0, 1],
    translateY: [8, 0],
    filter: ["blur(2px)", "blur(0px)"],
    duration: 520,
  }, "-=160");
```

Duration:

- Ticket surface: 320ms to 420ms.
- Target sentence: 480ms to 620ms.

Easing:

- `outCubic`.

Why it improves UX:

- The target answer feels uncovered rather than simply inserted.
- The reveal becomes a clear state transition in the learning loop.

What to avoid:

- Do not flip, rotate, bounce, or pop the ticket.
- Do not animate the ticket shape or `clip-path`.
- Do not add a confetti, success, or reward effect.
- Do not animate individual Cyrillic characters.

## Animation 4: Textarea Reset And Focus Behavior

Trigger:

- `sentence?.id`, `sourceLanguage`, or `targetLanguage` changes and the answer resets.
- Optional: user focuses the textarea.

Target element:

- `.answer-field textarea`

Anime.js API:

- `animate` on the textarea ref.
- Use the existing reset effect as the trigger, but do not change reset logic.

Suggested reset motion:

```ts
animate(textareaRef.current, {
  opacity: [0.72, 1],
  translateY: [4, 0],
  duration: 320,
  ease: "outSine",
});
```

Suggested focus motion:

```ts
animate(textareaRef.current, {
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 22px rgba(112,73,30,0.08)",
    "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 28px rgba(159,36,24,0.11)"
  ],
  duration: 260,
  ease: "outSine",
});
```

Duration:

- Reset: 280ms to 360ms.
- Focus: 220ms to 300ms.

Easing:

- `outSine`.

Why it improves UX:

- The reset becomes visible without needing a message.
- Focus feels tactile and paper-like, reinforcing where the user should type.

What to avoid:

- Do not auto-focus the textarea unless explicitly requested later.
- Do not animate textarea height.
- Do not animate while the user is typing.
- Do not flash bright colors.

## Animation 5: Progress Number Update

Trigger:

- `remainingInPass`, `deckSize`, or `shownCount` changes.

Target element:

- `.deck-progress-shell strong`
- Optional: `.deck-progress-shell small`

Anime.js API:

- `animate` with a JavaScript object value for numeric interpolation.
- Use `onUpdate` to set text content.

Suggested motion:

```ts
const count = { value: previousRemaining };

animate(count, {
  value: nextRemaining,
  duration: 420,
  ease: "outCubic",
  modifier: Math.round,
  onUpdate: () => {
    strongRef.current.textContent = `${Math.round(count.value)} / ${deckSize}`;
  },
});

animate(strongRef.current, {
  opacity: [0.55, 1],
  translateY: [3, 0],
  duration: 300,
  ease: "outSine",
});
```

Duration:

- Number interpolation: 360ms to 480ms.
- Visual emphasis: 260ms to 340ms.

Easing:

- `outCubic` for number interpolation.
- `outSine` for opacity movement.

Why it improves UX:

- Progress changes become perceptible without turning progress into the main focus.
- It supports the deck-loop mental model.

What to avoid:

- Do not use a progress bar or large animated track.
- Do not make the progress card pulse repeatedly.
- Do not animate every render when the number did not change.

## Animation 6: Optional Filter Or Deck Setting Change

Trigger:

- Source, target, topic, or level select changes.

Target element:

- `.filter-bar`
- `.filter-bar__control`
- `.practice-card`

Anime.js API:

- `animate` on the filter rail or current changed control.
- Optional `createScope` inside `FilterBar`.

Suggested motion:

```ts
animate(changedControlRef.current, {
  opacity: [0.72, 1],
  translateY: [3, 0],
  duration: 260,
  ease: "outSine",
});
```

Optional deck refresh cue:

```ts
animate(".practice-card", {
  opacity: [0.86, 1],
  translateY: [6, 0],
  duration: 420,
  ease: "outCubic",
});
```

Duration:

- Control cue: 220ms to 300ms.
- Deck refresh cue: 360ms to 460ms.

Easing:

- `outSine` for controls.
- `outCubic` for deck refresh.

Why it improves UX:

- The user sees that the deck settings affected the current practice card.
- It gives feedback without making the settings area feel like a dashboard.

What to avoid:

- Do not animate every select when only one setting changes.
- Do not shake invalid states.
- Do not delay the filter update.
- Do not animate layout height.

## Component Changes Needed

### `App.tsx`

- Add a root ref to `.app-shell`.
- Add a scoped initial entrance effect.
- Use `createScope` for cleanup:

```ts
const rootRef = useRef<HTMLElement | null>(null);
```

- Do not change `useSentenceDeck`.
- Do not change `nextSentence`.
- Do not delay initial rendering.

### `PracticeCard.tsx`

- Add refs:
  - `cardRef`
  - `sourceSentenceRef`
  - `sourceDividerRef`
  - `textareaRef`
  - `targetTicketRef`
  - `targetSentenceRef`
- Trigger source animation from `sentence?.id`.
- Trigger textarea reset cue from the same dependency array currently used for answer reset.
- Trigger ticket reveal animation from `isRevealed`.
- Keep `answer` and `isRevealed` local state unchanged.
- Keep the existing reset effect unchanged, or place animation after the reset inside the same effect.

### `TargetTicketCard`

- Either keep it inside `PracticeCard.tsx` and forward refs manually, or extract it only if ref wiring becomes noisy.
- Add stable data attributes only if useful:
  - `data-reveal-state="hidden"`
  - `data-reveal-state="revealed"`
- Do not change the card content contract.

### `DeckProgress.tsx`

- Add refs for:
  - the numeric `strong`
  - optional note `small`
- Track previous remaining value with `useRef`.
- Animate only when the numeric value actually changes.
- Keep the `aria-label` accurate.

### `FilterBar.tsx`

- Optional only.
- If implemented, track the changed filter key and animate just that `.filter-bar__control`.
- Keep native select behavior.
- Do not replace selects with custom dropdowns.

## CSS Changes Needed

Add small animation-support styles only:

```css
.anime-ready .app-shell,
.anime-ready .practice-card,
.anime-ready .source-sentence,
.anime-ready .target-sentence {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .app-shell,
  .practice-card,
  .source-sentence,
  .target-ticket__surface,
  .target-sentence,
  .answer-field textarea,
  .deck-progress-shell strong {
    transition: none;
    animation: none;
  }
}
```

Guidance:

- Use `will-change` sparingly and remove it in `onComplete` if implementation adds it dynamically.
- Do not set initial opacity to `0` in CSS unless JavaScript adds a ready class immediately. Otherwise no-JS or reduced-motion users may see missing content.
- Keep existing paper textures and borders static.

## Implementation Phases

### Phase 1: Dependency And Motion Guard

Human action:

- Approve adding `animejs` to dependencies.

AI action:

- Install Anime.js.
- Add a reduced-motion helper.
- Add one small animation utility if needed, for example `src/lib/motion.ts`.

Acceptance:

- App builds with Anime.js installed.
- Reduced-motion users get instant state changes.

### Phase 2: Initial Entrance

Human action:

- Confirm the entrance feels calm and not like a landing page.

AI action:

- Add scoped entrance animation in `App.tsx`.
- Clean up scope on unmount.

Acceptance:

- Page entrance is subtle.
- Interactivity is not delayed.

### Phase 3: Sentence And Textarea State Cues

Human action:

- Test `Next` several times with short and long sentences.

AI action:

- Animate `.source-sentence` on `sentence?.id`.
- Animate textarea reset cue after answer clears.

Acceptance:

- New sentence arrival is clear.
- No layout jank appears for long sentences.
- Textarea reset is visible but not distracting.

### Phase 4: Target Reveal

Human action:

- Confirm the target reveal feels like uncovering a reference, not a reward animation.

AI action:

- Animate ticket surface and target sentence when `isRevealed` becomes true.
- Skip or minimize animation when hiding the reference.

Acceptance:

- Reveal improves comparison flow.
- No flip, bounce, or flashy effect is introduced.

### Phase 5: Progress And Optional Filter Feedback

Human action:

- Confirm whether filter setting changes need a visible cue.

AI action:

- Animate progress number update.
- Optionally animate only the changed filter control.

Acceptance:

- Progress remains secondary.
- Settings remain quiet.

### Phase 6: QA

Human action:

- Review desktop and mobile motion.

AI action:

- Run `npm run build`.
- Test reduced motion.
- Test loading, empty, reveal, next, reshuffle, and filter changes.
- Check console for animation cleanup warnings.

Acceptance:

- Build passes.
- Motion improves clarity.
- No app logic changes.
- No animation causes layout jank.

## Recommended Defaults

- Initial entrance: 700ms to 900ms total, `outCubic`.
- Sentence change: 420ms to 520ms, `outCubic`.
- Target reveal: 480ms to 620ms, `outCubic`.
- Textarea reset: 280ms to 360ms, `outSine`.
- Progress update: 360ms to 480ms, `outCubic`.
- Filter cue: 220ms to 300ms, `outSine`.

## Explicit Non-Goals

- No text splitting for source or target sentences.
- No scroll animations.
- No draggable interactions.
- No SVG drawing effects.
- No motion paths.
- No bouncing, elastic, spring, or reward effects.
- No delays to randomizer or deck logic.
- No custom select controls.
- No persistent animation loops.
