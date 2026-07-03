# Speaking Mode Layout Plan

## 1. Current UI Structure Summary

This is a targeted UX expansion of the existing study interface. The current app is organized around typing practice, with the sentence deck and filter logic kept outside the practice card.

Relevant files:

- `src/App.tsx`
  - Owns the page shell, intro loader, header, filter rail, deck progress, and the main practice workspace.
  - Calls `useSentenceDeck()` and passes the current sentence, loading state, selected source/target languages, deck progress, and `nextSentence` handler into `PracticeCard`.
  - Currently has a `SHOW_TEGAKI_FONT_PREVIEW` constant set to `true`, which short-circuits the normal app and renders the Tegaki font preview. This should be disabled before implementing or testing Speaking Mode.

- `src/hooks/useSentenceDeck.ts`
  - Loads `/data/sentences.json`.
  - Stores `filters`, `current`, `queue`, `shownCount`, loading, and error state.
  - Filters sentences by `topic` and `level`.
  - Does not filter by `sourceLanguage` or `targetLanguage`; those values only decide which sentence fields are displayed.
  - Provides `nextSentence()`, which advances through the queue and reshuffles when the pass is complete.

- `src/components/FilterBar.tsx`
  - Controls source language, target language, topic, and level.
  - Uses native selects and existing paper/editorial styling.
  - Does not currently include any practice mode selection.

- `src/components/DeckProgress.tsx`
  - Displays shown count, remaining count, and total deck size.
  - Animates count changes with Anime.js.

- `src/components/PracticeCard.tsx`
  - Controls the current typing-practice screen.
  - Owns local `answer` and `isRevealed` state.
  - Resets `answer` and `isRevealed` when the sentence or selected languages change.
  - Computes `sourceSentence` and `targetSentence` by indexing the sentence with `sourceLanguage` and `targetLanguage`.
  - Shows the source sentence, a textarea for the user translation, and a target ticket panel.
  - Before reveal, the primary action is `Reveal`.
  - After reveal, the actions are `Hide` and `Next ->`.
  - Uses Anime.js timelines for target reveal animation and smaller text/source transitions.

- `src/components/HandwrittenSourceSentence.tsx`
  - Renders the source sentence.
  - Uses the Tegaki handwriting renderer for supported English source text when enabled.
  - Falls back to a normal blockquote.
  - Speaking Mode should reuse this component so the source sentence keeps the same visual language.

- `src/components/PaperPanel.tsx` and `src/components/PaperButton.tsx`
  - Provide reusable surface and button primitives.
  - Speaking Mode should reuse these rather than introduce new UI primitives.

- `src/styles.css`
  - Contains the visual system: vintage paper surfaces, Soviet-inspired red/pink/green accents, editorial typography, control rail, practice card grid, source sentence styles, target ticket styles, buttons, and responsive rules.
  - Current `PracticeCard` uses a left-right grid: source and textarea on the left, target ticket on the right.

Current state and data flow:

- Source and target language come from `filters.sourceLanguage` and `filters.targetLanguage`.
- Deck progress comes from `useSentenceDeck`.
- Reveal state is local to `PracticeCard`.
- Typed answer state is local to `PracticeCard` and only matters for Typing Mode.
- Loading and empty sentence states are handled inside `PracticeCard`.
- Error state is surfaced in `App.tsx` above the practice card.

## 2. Proposed Speaking Mode UX

Speaking Mode should sit beside Typing Mode, not replace it. It should remove the textarea and use a vertical source-to-reference flow designed for saying the answer out loud.

### Desktop Layout

Keep the existing app shell:

- Header remains at the top.
- Filter rail remains on the left.
- Practice workspace remains on the right.
- Speaking Mode uses a narrower, centered vertical card inside the current workspace instead of the existing two-column comparison layout.

Speaking card structure:

1. Top source panel
   - Source language label.
   - Source sentence.
   - Optional small prompt: "Say the translation out loud, then reveal the reference."

2. Stable action row
   - Before reveal: `Reveal`.
   - After reveal: `Again` and `Next card`.

3. Bottom target/reference panel
   - Always occupies space below the source area.
   - Before reveal, it appears as a quiet hidden reference panel without showing the answer.
   - After reveal, it shows the target language label and translated sentence.

### Mobile Layout

Use the same vertical order:

1. Filters.
2. Source panel.
3. Action row.
4. Target/reference panel.

Mobile behavior:

- No textarea.
- The target panel remains below the source.
- Buttons should stack or use a compact two-button row only if the text fits comfortably.
- Long sentences should wrap naturally without overflowing or shrinking into unreadability.

### Before Reveal State

- Source sentence is visible and visually stable.
- Target/reference area is present but hidden.
- The hidden panel can show a restrained label like `Reference hidden`, but it must not render the actual answer text.
- Primary action is `Reveal`.

### After Reveal State

- Source sentence remains in the same position.
- Target/reference answer appears below the source.
- The target panel can reuse the current pink ticket language to make the answer feel distinct.
- Actions become:
  - `Again`: hides the reference and keeps the same card.
  - `Next card`: advances to the next sentence.

### Empty, Loading, and Error States

- Loading can reuse the existing `PracticeCard` loading copy and surface style.
- Empty sentence state can reuse the existing "The archive drawer is empty" message.
- Error state should remain in `App.tsx` as it is today.

## 3. Component and State Changes Needed

Recommended implementation path: create a separate `SpeakingPracticeCard` component and keep the current `PracticeCard` as the Typing Mode component.

Reason:

- Speaking Mode removes the textarea and changes the layout structure.
- The existing `PracticeCard` has several effects and refs specifically tied to typing.
- A separate component avoids adding many conditional branches to the current card and lowers the risk of breaking Typing Mode.

Suggested component changes:

- Add a `PracticeMode` type:
  - `"typing"`
  - `"speaking"`

- Add mode state in `App.tsx`:
  - `const [practiceMode, setPracticeMode] = useState<PracticeMode>("typing");`

- Add a small mode switch control:
  - Could be `PracticeModeSwitch.tsx`.
  - Place it in the control rail near `FilterBar`, because it controls the practice experience but does not belong to sentence filtering.
  - Use existing paper/control styling rather than introducing a new component library.

- Add `SpeakingPracticeCard.tsx`.
  - Props should mirror the current `PracticeCard` props where practical:
    - `isLoading`
    - `onNext`
    - `remainingInPass`
    - `sentence`
    - `sourceLanguage`
    - `targetLanguage`

- Extract or share small helpers from `PracticeCard.tsx`:
  - `languageDisplayLabels`
  - Vietnamese text class helper.
  - Source sentence class helper if needed.

Reusable state:

- Reuse local `isRevealed` inside `SpeakingPracticeCard`.
- Reset `isRevealed` when `sentence.id`, `sourceLanguage`, or `targetLanguage` changes.
- Reuse `nextSentence` from `useSentenceDeck`.
- Reuse selected source and target languages from existing filters.

State to remove or ignore in Speaking Mode:

- `answer`
- `setAnswer`
- `textareaRef`
- Textarea reset animation.
- Textarea focus animation.

Mode persistence:

- Start without persistence.
- If persistence is desired later, use `localStorage` for the selected practice mode.
- Do not put the mode inside `SentenceFilters`, because it does not affect the sentence deck.

## 4. Styling Plan

Speaking Mode should feel like the same app, not a separate feature bolted on afterward.

### Layout Classes to Add

Likely new classes:

- `.practice-mode-switch`
- `.practice-mode-switch__button`
- `.practice-mode-switch__button--active`
- `.speaking-practice-card`
- `.speaking-practice-card__stack`
- `.speaking-source-panel`
- `.speaking-source-panel__header`
- `.speaking-source-panel__prompt`
- `.speaking-practice-card__actions`
- `.speaking-target-panel`
- `.speaking-target-panel--hidden`
- `.speaking-target-panel--revealed`
- `.speaking-target-panel__label`
- `.speaking-target-panel__sentence`

### Visual Direction

- Reuse `PaperPanel` as the outer shell.
- Reuse the current source sentence typography and handwritten rendering.
- Use the existing pink ticket styling as inspiration for the revealed target panel.
- Use the existing Soviet green as the hidden/reference-waiting accent.
- Keep border radius subtle, matching the current panel and ticket language.

### Source Stability

The source sentence must not move when the answer appears.

Implementation rules:

- Keep the source panel at the top of the card.
- Render the target panel below the actions in both hidden and revealed states.
- Give the target panel a stable `min-height`.
- Animate only internal opacity, transform, and small decorative details inside the target panel.
- Do not insert the target answer above the source.
- Do not change the outer card grid when revealing.

### Long Sentences

- Reuse existing `.source-sentence--long` logic.
- Speaking Mode can allow a wider sentence measure than Typing Mode because it uses the full vertical card width.
- Use `overflow-wrap: anywhere` only as a fallback for unusually long words.
- Prefer natural wrapping with `text-wrap: pretty` where supported.

### Small Screens

- Keep a single-column stack.
- Reduce card padding but preserve readable sentence sizes.
- Let action buttons become full width if needed.
- Keep the target panel visible below the source with a smaller but stable `min-height`.

## 5. Implementation Steps

1. Disable the current Tegaki preview branch before implementation QA.
   - Set `SHOW_TEGAKI_FONT_PREVIEW` to `false` or remove the preview shortcut when the feature work begins.

2. Add a `PracticeMode` type.
   - Best location: `src/types.ts` or local to `App.tsx` if only used there.

3. Add `practiceMode` state in `App.tsx`.
   - Default to `"typing"` so existing behavior stays unchanged.

4. Add a small mode switch component.
   - Suggested file: `src/components/PracticeModeSwitch.tsx`.
   - Use two options: `Typing` and `Speaking`.
   - Keep it visually consistent with existing form controls.

5. Extract shared language helpers if needed.
   - Suggested file: `src/lib/languageDisplay.ts` or `src/components/practiceTextUtils.ts`.
   - Keep this refactor small and mechanical.

6. Create `src/components/SpeakingPracticeCard.tsx`.
   - Reuse `PaperPanel`, `PaperButton`, and `HandwrittenSourceSentence`.
   - Implement local `isRevealed`.
   - Implement `Again` as `setIsRevealed(false)`.
   - Implement `Next card` as `onNext()`.

7. Add Speaking Mode reveal animation with Anime.js.
   - Use React refs for target panel and target sentence.
   - Use `createTimeline()` for the reveal.
   - Clean up animations on unmount and before rerunning.
   - Respect `usePrefersReducedMotion`.

8. Add speaking styles to `src/styles.css`.
   - Place them near the existing practice card styles.
   - Reuse current tokens and responsive breakpoints.

9. Wire conditional rendering in `App.tsx`.
   - If `practiceMode === "typing"`, render `PracticeCard`.
   - If `practiceMode === "speaking"`, render `SpeakingPracticeCard`.

10. QA both modes.
   - Typing Mode reveal, hide, answer typing, next card.
   - Speaking Mode reveal, again, next card.
   - Source and target language changes.
   - Topic and level filter changes.
   - End-of-pass reshuffle.
   - Loading, empty, and error states.
   - Desktop and mobile widths.
   - Reduced motion.

## 6. Acceptance Criteria

- Speaking Mode has no textarea.
- Speaking Mode shows the source sentence first.
- User can click `Reveal` after speaking out loud.
- Target/reference answer appears below the source only after reveal.
- Source sentence remains visually stable before and after reveal.
- `Again` hides the revealed answer and keeps the same sentence.
- `Next card` advances through the existing deck.
- Source language, target language, topic, and level filters still work.
- Deck progress still reflects the existing deck flow.
- Existing Typing Mode behavior is not broken.
- Desktop and mobile layouts are usable.
- Reduced-motion users do not get complex reveal animation.
- Anime.js timelines are cleaned up on unmount.

## 7. Risks and Decisions

- `SHOW_TEGAKI_FONT_PREVIEW = true` currently prevents the normal app from rendering. This must be resolved before implementing or testing Speaking Mode.
- A separate `SpeakingPracticeCard` is the safest default. A single `PracticeCard` with a mode prop would create more conditional logic around textarea-specific state and effects.
- `Again` should mean "hide the reference and try the same sentence again." It should not advance the deck.
- Speaking Mode should not add speech recognition, recording, scoring, or microphone permissions. The goal is self-practice only.
- Mode should not be part of `SentenceFilters` because it does not change which sentences are available.
- The hidden target panel must not expose the target answer before reveal. If accessibility handling becomes complex, render the answer only after `isRevealed` is true.
- Keep styling changes scoped. Do not redesign the app shell, filters, deck logic, or existing typing layout as part of this feature.
