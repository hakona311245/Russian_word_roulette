# Frontend Improvement Plan

## Design Read

Reading this as a redesign of a focused language-practice web app for casual learners, with a vintage study-hall visual language inspired by `Design_folder/reference.png`.

The target is reference-inspired and practical, not pixel-close. The app should adopt the reference's composed parchment page, deep red accent, progress card, filter/action rail, and two-column practice layout while preserving usability, responsiveness, and the existing deck behavior.

## Current State

- Stack: Vite, React, TypeScript, and plain CSS.
- Styling: `src/styles.css` uses parchment colors, red accent, serif title treatment, and paper panels.
- Main flow: `src/App.tsx` renders header, filters, error state, and practice card.
- Practice logic: `src/components/PracticeCard.tsx` owns answer text and reveal state.
- Data: sentences are loaded from `public/data/sentences.json`.
- Reference: `Design_folder/reference.png` shows the desired study-hall composition.

## Design Defaults

- Use native React and CSS. Do not add a heavy design system.
- Keep one accent color: deep red.
- Preserve the existing single-page app model.
- Preserve sentence data, filters, deck shuffle behavior, reveal behavior, and textarea reset behavior.
- Prioritize the practice experience over decorative accuracy.
- Keep the layout light enough for repeated daily use.
- Use square or lightly chamfered paper shapes. Avoid mixed radius systems.
- Avoid decorative complexity that harms mobile readability.

## Phase 1: Confirm Design Target And Constraints

### Human Steps

- Confirm that the visual target remains reference-inspired and practical.
- Confirm that no new design-system dependency should be added.
- Confirm that the current app behavior should remain unchanged.
- Confirm whether a custom font is acceptable later. Default is to use system fonts and existing serif fallbacks.

### AI Agent Steps

- Record the design direction before implementation.
- Treat `Design_folder/reference.png` as the composition reference.
- Keep all behavior-preserving constraints visible during implementation.
- Do not modify `public/data/sentences.json`.

### Acceptance Goal

- The implementation direction is clear before code changes begin.
- No engineer or AI agent needs to ask whether this is pixel-close, loose, or practical-reference work.

## Phase 2: Audit Current UI And Preserve Working Behavior

### Human Steps

- Run the app locally and confirm the current flow still represents the intended practice loop.
- Note any existing behavior that should not be touched.

### AI Agent Steps

- Inspect `src/App.tsx`, `src/components/FilterBar.tsx`, `src/components/PracticeCard.tsx`, `src/hooks/useSentenceDeck.ts`, and `src/styles.css`.
- Confirm the current deck lifecycle:
  - Load sentences.
  - Filter sentences.
  - Shuffle filtered deck.
  - Advance with `Next`.
  - Reshuffle when the filtered pass is complete.
  - Reset answer and reveal state when the sentence or language changes.
- Identify which layout changes are visual only and which require component interface changes.

### Acceptance Goal

- Existing behavior is documented before visual work starts.
- The redesign does not accidentally change deck, filter, reveal, or reset behavior.

## Phase 3: Recompose The Page Shell

### Human Steps

- Review the first implementation screenshot and confirm the overall composition feels like the reference without becoming too ornate.

### AI Agent Steps

- Rework `src/App.tsx` around a composed page shell:
  - Top identity area.
  - Center title area.
  - Deck progress area.
  - Filter/action rail.
  - Main practice workspace.
- Keep the app as one page.
- Use semantic regions where practical: `main`, `header`, and labeled sections.
- Keep the title text as `Russian Word Roulette`.

### Acceptance Goal

- Desktop layout has a clear poster-like structure.
- Header, progress, filters, and practice workspace feel intentionally placed, not stacked as unrelated panels.
- No route, data, or app architecture changes are introduced.

## Phase 4: Add Identity And Deck Progress

### Human Steps

- Confirm final microcopy for the study identity block. Default copy:
  - Title: `Practice Hall`
  - Body: `A place for thoughtful practice and steady progress.`
- Confirm whether the progress card should show `shown / deckSize` or `remaining / deckSize`. Default is `shown / deckSize`.

### AI Agent Steps

- Add a small identity block in the top-left area.
- Add a progress card in the top-right area.
- Introduce a small `DeckProgress` component if it keeps `App.tsx` cleaner.
- `DeckProgress` should accept:
  - `shownCount`
  - `deckSize`
  - `remainingInPass`
- Progress math:
  - `shown = Math.min(shownCount, deckSize)`
  - `percentage = deckSize > 0 ? shown / deckSize : 0`
- Avoid fake precision and decorative counters.

### Acceptance Goal

- The user can see current deck progress without reading the practice card metadata.
- Empty deck state displays safely without division errors.
- Progress visual uses the same deep red accent and passes contrast checks.

## Phase 5: Upgrade Filter And Action Rail

### Human Steps

- Confirm whether `Next` should appear both in the filter rail and in the practice card. Default is one primary `Next` action in the filter/action rail and one secondary placement only if mobile usability requires it.

### AI Agent Steps

- Restyle `FilterBar` to resemble the reference rail.
- Keep all existing filter labels and values.
- Add an optional action slot to `FilterBar` if needed so `Next` can sit in the same visual row.
- Keep labels above controls.
- Preserve keyboard focus and native select behavior.
- Keep form controls readable against the parchment background.

### Acceptance Goal

- Filters and primary action read as one functional control strip.
- Select controls remain keyboard accessible.
- `Next` still advances or reshuffles the filtered deck.
- No placeholder-as-label pattern is introduced.

## Phase 6: Rebuild The Practice Area

### Human Steps

- Confirm whether the target/reference panel should be visible before reveal. Default is yes, with a quiet study prompt until reveal.

### AI Agent Steps

- Recompose `PracticeCard` into a two-column desktop layout:
  - Left column: source label, source sentence, textarea, reveal button.
  - Right column: target label and reference panel.
- Before reveal, show a short study prompt in the target panel.
- After reveal, show the target translation in the same panel.
- Keep `answer` local state.
- Keep `isRevealed` local state.
- Continue resetting `answer` and `isRevealed` in the existing effect.
- Keep long sentence handling for source text.
- Preserve Vietnamese text class handling.

### Acceptance Goal

- Desktop practice area visually matches the reference's left-source and right-target relationship.
- Revealing the answer does not cause a large layout jump.
- Textarea remains easy to use.
- Empty and loading states still render cleanly.

## Phase 7: Refine The Visual System

### Human Steps

- Review visual tone after the first pass and flag if it feels too ornate, too plain, or too dark.

### AI Agent Steps

- Refine CSS variables in `src/styles.css` around semantic tokens:
  - `--accent`
  - `--accent-strong`
  - `--paper`
  - `--paper-soft`
  - `--paper-deep`
  - `--ink`
  - `--muted`
  - `--rule`
  - `--shadow`
- Add a page frame inspired by the reference using CSS borders and pseudo-elements.
- Add subtle parchment texture using gradients only.
- Keep ornamentation lightweight and non-interactive.
- Improve title scale so it fits on desktop and mobile.
- Use deep red consistently for labels, title, progress, and primary button.
- Keep focus rings visible and high contrast.

### Acceptance Goal

- The app reads as a cohesive vintage study interface.
- One accent color is used consistently.
- The UI does not become a beige-and-red decoration exercise at the expense of practice usability.
- No pure black or pure white is required for the visual system.

## Phase 8: Add Responsive Rules

### Human Steps

- Check the app on a phone-sized viewport and confirm the order feels natural for practice.

### AI Agent Steps

- Define explicit responsive behavior:
  - Desktop: composed poster layout with two-column practice workspace.
  - Tablet: compact header, two-column or stacked filters depending on available width.
  - Mobile: single column order of progress, filters, source, textarea, target, actions.
- Ensure title does not overflow.
- Ensure button labels do not wrap awkwardly.
- Ensure selects, textarea, and buttons have comfortable tap targets.
- Avoid viewport-height traps. Use stable min-height behavior.

### Acceptance Goal

- The app is usable at desktop, tablet, and mobile widths.
- No text overlaps or clips.
- No horizontal scrolling appears on mobile.
- The mobile layout is stronger than a literal shrink of the desktop reference.

## Phase 9: Verify UI States

### Human Steps

- Confirm the visible copy for loading, empty, error, unrevealed, revealed, and reshuffle states.

### AI Agent Steps

- Verify these states:
  - Loading deck.
  - Fetch error.
  - No sentences match filters.
  - Unrevealed reference panel.
  - Revealed reference panel.
  - Last card before reshuffle.
  - New pass after reshuffle.
- Keep status messages plain and useful.
- Avoid fake motivational copy.

### Acceptance Goal

- All functional states are represented in the redesigned UI.
- State changes are understandable without reading the code.
- No state creates layout breakage or unreadable contrast.

## Phase 10: Build And Visual QA

### Human Steps

- Review final screenshots against the reference image.
- Approve whether the result is close enough or request a second design pass.

### AI Agent Steps

- Run `npm run build`.
- Open or screenshot the app at desktop width.
- Open or screenshot the app at mobile width.
- Check keyboard navigation through selects, textarea, reveal, and next.
- Check contrast for:
  - Primary button text.
  - Secondary button text.
  - Labels.
  - Placeholder text.
  - Progress card.
- Check visible copy for grammar and clarity.

### Acceptance Goal

- Build passes.
- Desktop screenshot shows the reference-inspired study-hall composition.
- Mobile screenshot is readable and free of overlap.
- Keyboard focus is visible.
- Loading, empty, error, reveal, and reshuffle states remain functional.

## Final QA Checklist

- [ ] `npm run build` passes.
- [ ] Desktop visual check completed.
- [ ] Mobile visual check completed.
- [ ] Keyboard focus visible on all interactive elements.
- [ ] Form contrast checked.
- [ ] Button contrast checked.
- [ ] Loading state checked.
- [ ] Empty state checked.
- [ ] Error state checked.
- [ ] Reveal state checked.
- [ ] Reshuffle behavior checked.
- [ ] Filters still update the sentence deck.
- [ ] `Next` still advances the deck.
- [ ] Answer text still resets on sentence or language change.
- [ ] No sentence data changed.
- [ ] No heavy UI dependency added.

## Out Of Scope

- Adding accounts, history, scoring, spaced repetition, or persistence.
- Changing sentence schema or deck filtering rules.
- Adding a routing system.
- Adding a full design system.
- Pixel-perfect cloning of the reference image.
- Dark mode unless specifically requested later.

