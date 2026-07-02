# UX Redesign Plan

## Design Read

Reading this as a targeted UX redesign of a static language-practice app for self-study learners, with a calm sequential practice flow and a vintage paper study-hall visual language.

This is not a visual reset. Keep the current parchment, deep red accent, editorial type, and ticket-like target panel. The work is to reduce competition between controls, make the learning sequence obvious, and keep only one dominant action visible at a time.

## Core UX Goal

The page should guide one loop:

1. Choose deck settings.
2. Read the source sentence.
3. Type a translation attempt.
4. Reveal the reference translation.
5. Compare the attempt against the reference.
6. Continue to the next sentence.

Primary-action rule:

- Before reveal: `Reveal` is the dominant action.
- After reveal: `Next` is the dominant action.
- `Next` should not appear as a major action before the user reveals the answer.

## Current UX Diagnosis

The visual direction is close, but the hierarchy is overloaded.

- The giant `Russian Word Roulette` title behaves like the main content even though the practice card should be the main content.
- The top filter rail looks like a large dashboard form, not lightweight deck settings.
- The top `Next ->` button asks the user to advance before they have practiced.
- The `Practice Hall` block and plus mark add visual weight without helping the learning loop.
- Deck progress is useful, but the current card competes with the practice task.
- The practice card repeats metadata that is already implied by filters and labels.
- `Reveal` and `Next` are split between the rail and the card, which weakens the sequential flow.

## What Should Stay

- Keep the source sentence as the central reading object.
- Keep the textarea as the learner's active work area.
- Keep the target translation ticket panel.
- Keep the unrevealed target prompt, but make it quieter than the source/input area.
- Keep deck filters: source language, target language, topic, and level.
- Keep deck progress, but make it secondary.
- Keep loading, empty, error, reveal, and reshuffle states.
- Keep the vintage paper/editorial art direction.
- Keep native React and CSS. Do not add a heavy UI library.

## What Should Be Removed, Merged, Or Moved

### Remove Or Demote

- Remove the top `Next ->` button from the filter rail.
- Remove the large plus mark unless it becomes a meaningful small brand seal.
- Demote the giant title to a compact app identity.
- Demote the progress card to a small inline counter or compact side note.
- Remove duplicated card metadata such as language codes and progress if the same information already appears in labels and progress.

### Merge

- Merge the current `Practice Hall` block and app title into a simpler header identity.
- Merge progress with deck settings or place it as a small line near the card header.
- Merge action feedback with the active card state:
  - Before reveal: show a quiet note about revealing when ready.
  - After reveal: show a quiet note about continuing or reshuffling.

### Move

- Move all major practice actions into `PracticeCard`.
- Move deck settings into a lighter `DeckSettings` area above the card.
- Keep filters near the top, but visually treat them as setup, not task controls.
- Move reshuffle wording near the `Next` button after reveal, not before practice starts.

## Ideal Page Hierarchy

Recommended desktop hierarchy:

1. Compact page header
   - Small app name: `Russian Word Roulette`
   - Optional subtitle: `Translation practice`
   - Small progress text: `19 / 20 remaining`
2. Deck settings rail
   - Source, target, topic, level
   - No primary action button
   - Visually lighter than the practice card
3. Practice card
   - Main focus of the page
   - Left: source sentence and translation attempt
   - Right: target reference ticket
   - The dominant action changes based on reveal state
4. Status/error area
   - Inline and quiet
   - Never visually louder than the practice card unless the app cannot proceed

The practice card should be visually larger and more central than the header, filters, and progress.

## Ideal Practice Card Flow Before Reveal

Before reveal, the card should ask the learner to work.

Left column:

- Label: `SOURCE (VIETNAMESE)` or current source language.
- Large source sentence.
- Decorative divider.
- Label: `YOUR TRANSLATION`.
- Textarea.
- Primary button: `Reveal`.

Right column:

- Label: `TARGET (RUSSIAN)` or current target language.
- Ticket panel remains visible.
- Reference text is hidden.
- Quiet prompt, for example: `Write your attempt first, then reveal the reference.`
- Study note can remain, but it should not compete with the source sentence.

Action behavior:

- `Reveal` is the only dominant button.
- Do not show a large `Next` button.
- If skipping is needed later, add a small secondary text action only after explicit approval.

Acceptance goal:

- A first-time user understands that the next step is to type and reveal.
- No visible major control encourages skipping the practice attempt.

## Ideal Practice Card Flow After Reveal

After reveal, the card should shift from work mode to comparison mode.

Left column:

- Keep the user's attempted translation visible.
- Keep textarea editable so the user can correct or annotate their attempt.
- Primary action should no longer be `Reveal`.
- Optional secondary action: `Hide reference` or `Edit attempt`, visually quiet.

Right column:

- Show the target translation in the ticket panel.
- Keep the same panel dimensions to avoid layout jump.
- Keep the study note below the translation or reduce it after reveal if it adds clutter.

Action behavior:

- Primary button becomes `Next`.
- `Next` should sit close to the comparison area, preferably in the card action row.
- If `remainingInPass === 0`, label the supporting text as `Next reshuffles this deck.`

Acceptance goal:

- The user naturally compares, then continues.
- The primary action switch is obvious without adding extra controls.

## Mobile Layout Behavior

Mobile should follow the learning sequence exactly:

1. Compact header.
2. Small deck settings summary or collapsed settings.
3. Source sentence.
4. Textarea.
5. Primary action.
6. Target ticket.
7. Next action after reveal.

Recommendations:

- Collapse deck settings into a compact vertical group or a `Deck settings` disclosure if the rail feels too tall.
- Keep the title small enough that the source sentence appears early.
- Put `Reveal` immediately after the textarea before reveal.
- After reveal, put `Next` immediately after the target/reference comparison or as a sticky bottom action if needed.
- Avoid horizontal scroll.
- Keep buttons at least 44px tall.
- Keep the target ticket below the textarea, not beside it.

Acceptance goal:

- On a phone, the user can complete a sentence without hunting between top controls and the practice card.

## Component Changes Needed

### `App.tsx`

- Remove the `Next` action from `FilterBar`.
- Simplify the top header structure.
- Keep `DeckProgress`, but pass it into a smaller placement or render it inline near the title/settings.
- Keep `PracticeCard` as the owner of reveal and next actions.

### `FilterBar.tsx`

- Remove or stop using the `action` slot for `Next`.
- Consider renaming the component to `DeckSettings` if it is restyled as a lightweight settings area.
- Keep native select controls and labels.
- Keep accessibility and keyboard behavior unchanged.

### `PracticeCard.tsx`

- Make the primary action conditional:
  - `Reveal` before `isRevealed`.
  - `Next` after `isRevealed`.
- Hide the major `Next` action before reveal.
- Keep `answer` local state.
- Keep `isRevealed` local state.
- Keep reset effect on sentence and language changes.
- Consider removing or compressing `practice-card__meta`.
- Keep the target ticket visible before reveal.

### `DeckProgress.tsx`

- Reduce visual weight.
- Consider a compact variant, for example:
  - `19 / 20 remaining`
  - `Ready to reshuffle`
  - `No matching cards`
- Keep the accessible `aria-label`.

### Optional Components

- `DeckSettings`: a lighter successor to `FilterBar`.
- `PracticeActionRow`: encapsulates the reveal/next state switch.
- `StudyHeader`: compact identity plus subtle progress.

## CSS And Layout Changes Needed

### Header

- Reduce `title-lockup h1` size substantially.
- Avoid making the app title the largest object on the page.
- Replace the three-column header with a calmer compact layout.
- Remove or shrink the `study-identity__mark`.

### Deck Settings

- Reduce padding and border intensity in `.filter-bar`.
- Remove the large action column.
- Make settings feel like paper tabs, a quiet rail, or a compact fieldset.
- Keep focus states clear.

### Progress

- Reduce `.deck-progress-shell` padding, shadow, and border weight.
- Consider inline placement instead of a card-like object.
- Avoid progress bars or filled tracks.

### Practice Card

- Increase the card's visual priority relative to the header.
- Keep the source/input column dominant before reveal.
- Keep the target ticket stable in size before and after reveal.
- Remove unused `.reveal-panel` styles if the ticket panel is the only reveal surface.
- Reduce or remove `.practice-card__meta` if duplicated.

### Buttons

- Keep only one primary button visible at a time.
- Before reveal: primary red `Reveal`.
- After reveal: primary red `Next`.
- Secondary actions should be paper/ink style and visually quieter.

## Phased Implementation Plan

### Phase 1: Confirm UX Direction

Human action:

- Confirm that `Next` should disappear as a major action until after reveal.
- Confirm whether a small skip action is needed. Default is no.

AI action:

- Treat this document as the source of truth for the next UX pass.
- Preserve all existing deck, filter, reveal, reset, and randomizer logic.

Acceptance goal:

- The team agrees that the practice card owns the learning flow.

### Phase 2: Simplify Page Header

Human action:

- Confirm final compact header copy.

AI action:

- Reduce the title scale.
- Merge or remove the `Practice Hall` block.
- Make progress secondary.

Acceptance goal:

- The practice card, not the title, is the first visual priority.

### Phase 3: Convert Filter Rail Into Deck Settings

Human action:

- Confirm whether settings should always be visible or collapsible on mobile.

AI action:

- Remove the top `Next` action.
- Restyle filters as lightweight deck settings.
- Preserve labels, select behavior, and filter logic.

Acceptance goal:

- Settings are easy to find but do not feel like the main task.

### Phase 4: Rework Practice Actions

Human action:

- Confirm button labels: `Reveal`, `Next`, and optionally `Hide reference`.

AI action:

- Make `PracticeCard` show `Reveal` before reveal.
- Make `PracticeCard` show `Next` after reveal.
- Keep target ticket dimensions stable.
- Keep answer editable after reveal.

Acceptance goal:

- There is one dominant primary action at a time.

### Phase 5: Remove Duplicate Metadata

Human action:

- Confirm whether topic/level should remain visible inside the card.

AI action:

- Remove duplicated language/progress metadata from the card.
- Keep only context that helps the learner.

Acceptance goal:

- The card feels focused and no longer reads like a dashboard.

### Phase 6: Mobile Flow Pass

Human action:

- Test the app on a phone-sized viewport and confirm the order feels natural.

AI action:

- Stack the mobile flow as source, textarea, reveal, target, next.
- Ensure settings do not push the practice task too far down.
- Check tap targets and wrapping.

Acceptance goal:

- A phone user can complete the learning loop without jumping back to the top of the page.

### Phase 7: Visual QA And State QA

Human action:

- Review desktop and mobile screenshots.

AI action:

- Run `npm run build`.
- Verify loading, empty, error, unrevealed, revealed, and reshuffle states.
- Check keyboard focus through selects, textarea, reveal, and next.
- Check button and form contrast.

Acceptance goal:

- UX is calmer, sequential, and still visually aligned with the vintage paper direction.

## Implementation Constraints

- Do not change `public/data/sentences.json`.
- Do not change sentence schema.
- Do not change randomizer behavior.
- Do not add a heavy UI library.
- Preserve native selects and textarea behavior.
- Preserve answer reset on sentence or language change.
- Preserve source and target language support.
- Preserve the vintage paper/editorial study hall art direction.
