# Aesthetic Change Plan

## Design Read

Reading this as a full visual redesign of a language-practice app for focused self-study, with a luxury museum-gallery language. The current interface has strong component craft, but the warm paper palette, poster framing, heavy red accents, and cut-ticket motif push it toward vintage classroom instead of contemporary museum.

Target direction:

- More gallery than parchment.
- More curated exhibit than old worksheet.
- More luxurious through proportion, restraint, contrast, material quality, and spacing.
- Keep the app practical. This is still a study tool, not a landing page.

Design dials:

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 5`
- `VISUAL_DENSITY: 4`

## Current Issues

### 1. Palette Feels Aged, Not Luxurious

The current cream, warm red, tan paper, and aged texture combination reads as vintage print. It is attractive, but it is also familiar and slightly nostalgic. Museum luxury should feel quieter, cooler, and more deliberate.

Problems to solve:

- The body background and app shell are both warm paper tones.
- Red is used as both identity color and functional accent, so it feels loud.
- The target ticket uses pink paper tones, which weakens the gallery atmosphere.
- Heavy texture everywhere lowers the perceived material quality.

### 2. Layout Still Feels Like A Framed Poster

The app is contained in one centered paper sheet. That gives the current design cohesion, but it also makes the whole product feel like a single poster or handout.

Problems to solve:

- Header, filters, and practice content all sit inside the same visual box.
- The filter bar consumes a full horizontal band and feels administrative.
- The practice card is still the dominant container, rather than the study interaction itself.
- The two-column practice area is good, but it needs stronger hierarchy and more gallery-like negative space.

### 3. Shape Language Is Too Sharp Everywhere

The zero-radius look supports the vintage poster idea, but a luxury interface benefits from subtle radius in select places. The key is to introduce radius as a material rule, not sprinkle it everywhere.

Problems to solve:

- Buttons, panels, inputs, and tickets are all sharp or clipped.
- The ticket shape is distinctive, but it reads more event stub than museum object label.
- Focus and form elements feel functional, not premium.

### 4. Typography Is Too Poster-Like

Georgia display text gives the app heritage, but uppercase poster styling and broad red titles make it feel older than intended. A museum interface can still use serif type, but it needs a stronger contrast between display, label, and utility text.

Problems to solve:

- The title dominates as a poster headline.
- Labels are all uppercase with similar tracking.
- Source and target sentences both use large serif type, reducing hierarchy.

## New Aesthetic Direction

Name: `Gallery Study Room`

Visual references:

- Contemporary museum wall labels.
- High-end exhibition catalogs.
- Quiet private reading rooms.
- Stone, glass, graphite, lacquer, and archival paper.

Avoid:

- Heavy parchment texture.
- Pink paper panels.
- Brass-heavy luxury.
- Large red poster blocks.
- Decorative ticket clipping.
- Overly rounded SaaS cards.

## Palette Plan

### Recommended Palette

Use a cool luxury neutral base with a single museum red accent.

```css
:root {
  --surface-page: #f3f1ec;
  --surface-gallery: #fbfaf7;
  --surface-panel: #eeece6;
  --surface-elevated: #ffffff;
  --ink: #171615;
  --ink-soft: #494640;
  --muted: #7a7469;
  --rule: rgba(23, 22, 21, 0.14);
  --rule-strong: rgba(23, 22, 21, 0.28);
  --accent: #9f1f1a;
  --accent-deep: #6f1411;
  --accent-soft: rgba(159, 31, 26, 0.08);
  --shadow: rgba(20, 18, 15, 0.12);
}
```

Why this works:

- `surface-page` is stone, not yellow paper.
- `surface-gallery` gives clean museum brightness.
- Red becomes a curatorial mark, not the entire identity.
- The app keeps warmth without becoming beige and brass.

### Optional Dark Museum Variant

If the redesign needs stronger luxury, use a mostly light app placed inside a dark outer gallery.

```css
:root {
  --gallery-wall: #171615;
  --surface-page: #e9e5dc;
  --surface-gallery: #fbfaf7;
  --ink: #171615;
  --accent: #b72922;
}
```

Use this only if the page can handle more contrast. Do not mix dark sections inside the app. Keep one global theme.

## Typography Plan

### Font Direction

Keep a serif for the study sentences because it supports language learning and museum labels. Refresh the rest of the UI with a more polished sans.

Recommended stack:

- Display and sentence serif: `Cormorant Garamond`, `EB Garamond`, or `Newsreader`.
- UI sans: `Geist`, `Satoshi`, `Aptos`, or system sans.
- Avoid making every label uppercase.

### Type Roles

1. App title:
   - Smaller than now.
   - Treat as gallery identity, not poster headline.
   - Use mixed case or small caps, not full uppercase.

2. Source sentence:
   - Keep large and serif.
   - Set as the main exhibit text.
   - Give it more whitespace and fewer surrounding ornaments.

3. Target sentence:
   - Slightly smaller than source.
   - Use a clean comparison panel, not a ticket stub.

4. Labels:
   - Replace most uppercase labels with compact museum-label text.
   - Example: `Source language`, `Reference translation`, `Your attempt`.

## Layout Redesign

### Current Layout

```txt
Centered paper shell
  Header with title and progress
  Full-width filter bar
  Large practice card
    Source column
    Target ticket
```

### Proposed Layout

```txt
Full gallery page
  Top museum rail
    App identity left
    Progress right

  Main two-zone workspace
    Left vertical settings rail
      Source
      Target
      Topic
      Level

    Right study table
      Exhibit sentence area
      Writing area
      Reference panel
      Action row
```

### Desktop Structure

Use a page-level grid:

```css
.app-shell {
  width: min(1440px, calc(100% - 40px));
  min-height: calc(100dvh - 40px);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 24px;
  background: transparent;
  box-shadow: none;
}

.study-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 24px;
}
```

This breaks the poster-sheet feeling and gives the app a curated gallery floor plan.

### Header

Replace the current poster header with a quiet museum rail.

Rules:

- No giant red H1.
- Title sits left as identity.
- Progress sits right as a collection counter.
- Use a thin border bottom, not a boxed header.
- Keep the handwriting entrance, but reduce it to title and underline only.

Suggested content:

```txt
Russian Roulette
Translation practice

12 / 40
remaining in current pass
```

### Filter Rail

Move filters from a full-width bar to a left settings rail.

Why:

- A horizontal filter bar makes the app feel like an admin tool.
- A rail feels like a museum placard panel or catalog index.
- The study surface can become the main event.

Visual rules:

- Subtle radius: `10px`.
- Light panel background.
- Hairline border.
- No heavy shadows.
- Select controls look like engraved fields, not browser defaults.

### Practice Workspace

Turn the practice card into a wide study table.

Structure:

```txt
Study table
  Source block
    Source label
    Sentence

  Lower split
    Writing field
    Reference panel

  Actions
```

Desktop grid:

```css
.practice-card__grid {
  grid-template-columns: minmax(0, 1fr);
}

.practice-card__comparison {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.8fr);
  gap: 20px;
}
```

This lets the source sentence own the top of the composition, which is better for learning and more elegant visually.

### Target Reference

Replace the clipped ticket with a museum object label.

Current:

- Polygon ticket shape.
- Pink target paper.
- Strong decorative border.

New:

- Rectangular reference slab.
- Radius `12px`.
- Off-white or smoked glass surface.
- Hairline border.
- Optional tiny red vertical rule on the left.

```css
.target-ticket__surface {
  border-radius: 12px;
  clip-path: none;
  background: var(--surface-elevated);
  border: 1px solid var(--rule);
  box-shadow: 0 20px 60px rgba(20, 18, 15, 0.08);
}
```

### Textarea

Make the input feel like an archival note field.

Rules:

- Radius `10px`.
- No lined-paper background.
- Use a clean inset surface.
- Keep a strong focus state.
- Increase comfort in the vertical rhythm.

```css
.answer-field textarea {
  border-radius: 10px;
  background: color-mix(in srgb, var(--surface-gallery), #000 2%);
  border: 1px solid var(--rule);
}
```

## Shape System

Use one subtle radius scale:

- Page and layout containers: `0px` or no container.
- Rail and main panels: `14px`.
- Reference panel and textarea: `12px`.
- Selects and buttons: `10px`.
- Tiny chips, if any: `999px`.

Avoid:

- Large `24px` cards.
- Pill buttons unless they are tiny metadata chips.
- Mixing sharp clipped tickets with rounded inputs.

## Component Changes

### `App.tsx`

Add a new layout wrapper:

```tsx
<main className="app-shell">
  <header className="museum-rail">...</header>
  <div className="study-layout">
    <aside className="settings-rail">...</aside>
    <section className="practice-workspace">...</section>
  </div>
</main>
```

Move `FilterBar` into the settings rail.

### `FilterBar.tsx`

Change from horizontal grid to vertical rail.

Rename CSS intent:

- `.filter-bar` can remain for compatibility.
- Add modifier class: `.filter-bar--rail`.

Do not replace native selects with custom dropdowns.

### `PracticeCard.tsx`

Restructure markup:

```txt
source exhibit
comparison grid
  answer field
  reference panel
action row
```

Keep state logic unchanged:

- `answer`
- `isRevealed`
- `onNext`
- reset behavior
- reveal animation

### `PaperPanel.tsx`

Either keep as a low-level primitive or rename mentally to `Surface`.

New role:

- It should not make everything look like paper.
- It should provide a neutral surface, border, radius, and optional elevation.

## Motion Plan

Motion should feel like exhibit labels settling into place, not paper cards fading in.

Keep:

- Handwriting title entrance.
- Source sentence change cue.
- Target reveal cue.
- Textarea reset cue.

Adjust:

- Remove broad page fades.
- Make reveal animation shorter and cleaner.
- Use mask or slight vertical movement for text only.

Motion durations:

- Page title: `900ms` to `1200ms`.
- Source sentence change: `360ms` to `460ms`.
- Target reveal: `260ms` to `360ms`.
- Textarea cue: `220ms` to `300ms`.

## Implementation Phases

### Phase 1: Token Rewrite

Replace color variables in `src/styles.css`.

Acceptance:

- Body no longer reads as yellow parchment.
- Red is used less often.
- Existing components still pass contrast.

### Phase 2: Layout Recomposition

Change the page from a single centered poster shell to the museum rail plus settings rail plus study workspace.

Acceptance:

- Filters sit in a left rail on desktop.
- Main practice interaction is the visual focus.
- Mobile stacks in this order: header, settings, source, input, reference, actions.

### Phase 3: Surface And Radius System

Update panels, buttons, inputs, selects, and reference card.

Acceptance:

- Radius is subtle and consistent.
- Ticket clipping is removed.
- Shadows are softer and rarer.

### Phase 4: Typography Refresh

Adjust title, labels, source sentence, and target sentence hierarchy.

Acceptance:

- Title feels like identity, not a poster.
- Source sentence is the main exhibit.
- Labels feel like museum placards, not dashboard labels.

### Phase 5: Motion Tuning

Retune existing Anime.js effects to match the new layout.

Acceptance:

- No component-wide first-load fade.
- Reveal and source changes support learning flow.
- Reduced motion still works.

### Phase 6: QA

Run:

```bash
npm.cmd run build
```

Check:

- Desktop at 1440px.
- Tablet at 820px.
- Mobile at 390px.
- Long source sentence.
- Long target sentence.
- Empty deck state.
- Loading state.
- Reveal, hide, next, and filter changes.

## Concrete CSS Targets

Replace:

- `--paper`
- `--paper-deep`
- `--paper-soft`
- `--target-paper`
- `--target-paper-deep`
- heavy warm gradients

Add:

- `--surface-page`
- `--surface-gallery`
- `--surface-panel`
- `--surface-elevated`
- `--radius-panel`
- `--radius-control`
- `--radius-field`

Remove or reduce:

- body paper grid texture
- `clip-path` ticket shape
- strong red title treatment
- heavy paper shadows
- ornamental divider diamond

## Risks

### Risk: Losing The Current Personality

The current design has a memorable vintage identity. A luxury museum redesign can become too sterile if all texture is removed.

Mitigation:

- Keep one subtle archival texture in the main study surface.
- Keep the red accent.
- Keep the handwriting title entrance.

### Risk: Over-Rounding

Too much radius will make the app feel like a generic SaaS interface.

Mitigation:

- Use radius only on interactive controls and panels.
- Keep page-level structure mostly square and architectural.

### Risk: Luxury Becoming Low Contrast

Luxury palettes often drift into gray-on-gray.

Mitigation:

- Keep body text near black.
- Keep labels at readable contrast.
- Test primary button contrast after palette changes.

## Definition Of Done

- The app no longer reads as old parchment or classroom worksheet.
- The layout no longer feels like one centered poster sheet.
- The source sentence feels like the main exhibit.
- Filters feel like a quiet catalog rail.
- The target reference feels like a museum label, not a ticket.
- Radius is present but restrained.
- Red is a precise accent, not a blanket theme.
- Build passes.
- Mobile remains practical for repeated study.
