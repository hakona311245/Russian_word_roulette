# Tegaki Source Sentence Animation Research

## Recommendation

Tegaki is viable for this app as progressive enhancement, but not as a one-step default for every source sentence.

Recommended path:

1. Phase 1: implement an English-only proof of concept with a built-in Tegaki Latin font, preferably `caveat`, and keep the current blockquote text as the fallback.
2. Phase 2: prefer language-specific font bundles instead of one universal font. Use one bundle for English, one for Russian, and one for Vietnamese if visual QA shows each language needs a different handwritten style.
3. Phase 3: integrate language-aware and glyph-aware fallback so unsupported or long sentences render as normal text with the existing subtle Anime.js transition.

Do not replace the source sentence wholesale with Tegaki until per-language bundle coverage, long-sentence behavior, reduced-motion behavior, and fallback behavior are proven in the actual app.

## Sources

- Tegaki homepage: <https://gkurt.com/tegaki/>
- Tegaki Getting Started: <https://gkurt.com/tegaki/getting-started/>
- Tegaki React guide: <https://gkurt.com/tegaki/frameworks/react/>
- Tegaki rendering guide: <https://gkurt.com/tegaki/guides/rendering/>
- Tegaki font generation guide: <https://gkurt.com/tegaki/guides/generating/>
- Tegaki text shaping guide: <https://gkurt.com/tegaki/guides/shaping/>
- Tegaki Vite bundler guide: <https://gkurt.com/tegaki/guides/bundlers/>
- Tegaki renderer API: <https://gkurt.com/tegaki/api/renderer/>
- npm metadata checked on 2026-07-03: `tegaki` latest was `0.20.0`; package has no normal dependencies, peers include `react >=18` and optional `harfbuzzjs`.

## Current App Findings

Source sentences are rendered in `src/components/PracticeCard.tsx` as:

```tsx
const sourceSentence = sentence[sourceLanguage];

<blockquote className={sourceSentenceClass} ref={sourceSentenceRef}>
  {sourceSentence}
</blockquote>
```

Languages are represented by `LanguageCode = "vi" | "en" | "ru"` in `src/types.ts`. Each sentence has `vi`, `en`, and `ru` fields, so the source sentence can be English, Russian, or Vietnamese depending on `filters.sourceLanguage`.

The language selectors are in `src/components/FilterBar.tsx`. Both source and target selectors use the same three-language list:

```ts
const languageLabels: Record<LanguageCode, string> = {
  vi: "Vietnamese",
  en: "English",
  ru: "Russian",
};
```

Sentence changes happen in `src/hooks/useSentenceDeck.ts`. `nextSentence()` advances `deck.current` to the next queued sentence or reshuffles the filtered deck when the queue is empty. Filter changes rebuild the deck through `filteredSentences`, which can also change the visible source sentence.

`PracticeCard` already resets study state when the current sentence or selected languages change:

```ts
useLayoutEffect(() => {
  setAnswer("");
  setIsRevealed(false);
}, [sentence?.id, sourceLanguage, targetLanguage]);
```

The current app already has animation code:

- `src/App.tsx` animates the title and underline with Anime.js.
- `src/components/IntroLoader.tsx` implements the intro overlay.
- `src/components/PracticeCard.tsx` animates source-sentence changes, textarea reset/focus, and target reveal.
- `src/components/FilterBar.tsx` animates changed controls.
- `src/components/DeckProgress.tsx` animates progress.
- `src/hooks/usePrefersReducedMotion.ts` already provides a reusable reduced-motion guard.

Current source sentence typography is in `src/styles.css`:

```css
.source-sentence {
  max-width: 16ch;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.2rem, 4vw, 3.7rem);
  font-weight: 500;
  line-height: 1.04;
  overflow-wrap: break-word;
  text-wrap: pretty;
}
```

Long sentences use `.source-sentence--long` at `sourceSentence.length > 70`. Vietnamese currently gets a `.lang-vi` class, but still uses the same Georgia serif stack.

Important data issue: `public/data/sentences.json` currently appears mojibake-encoded for Russian and Vietnamese when read from disk, for example strings beginning with `Ð` and `TÃ`. That is a separate data-encoding risk. Tegaki glyph testing should be done against the intended Unicode text, not the current mojibake bytes. This document does not propose changing sentence data because the request explicitly forbids it.

## Tegaki Capability Summary

Tegaki provides a React `TegakiRenderer` component:

```tsx
import { TegakiRenderer } from "tegaki";
import bundle from "tegaki/fonts/caveat";

<TegakiRenderer
  font={bundle}
  time={{ mode: "uncontrolled", speed: 1 }}
  style={{ fontSize: 48 }}
>
  Hello World
</TegakiRenderer>
```

The renderer accepts text through `children` or a `text` prop. It supports uncontrolled playback, controlled time, CSS-driven time, effects, `onComplete`, and an imperative handle. Tegaki's docs state that it handles text layout and line wrapping.

For Vite, Tegaki needs this dev-server config:

```ts
optimizeDeps: {
  exclude: ["tegaki"],
}
```

Without that, Vite dev can lose the TTF asset URL during prebundling and produce font 404s. Production Rollup builds are documented as working out of the box.

Built-in font bundles listed by Tegaki:

- `caveat`, `italianno`, `tangerine`, `parisienne`: Latin
- `suez-one`: Hebrew + Latin
- `amiri`: Arabic + Latin
- `tillana`: Devanagari + Latin
- `klee-one`: Japanese + Latin
- `nanum-pen-script`: Korean + Latin

Tegaki's generator can create custom bundles from Google Fonts. The default generator character set is `A-Za-z0-9` plus punctuation, so a custom bundle must explicitly include Cyrillic and Vietnamese characters.

## Research Questions

### 1. Can `TegakiRenderer` be used safely inside this React/Vite app?

Yes, with conditions.

The app uses React 19 and Vite 6. Tegaki's npm peer range includes `react >=18`, and its docs provide a React renderer. For Vite, the implementation should add `optimizeDeps.exclude: ["tegaki"]` to prevent dev-server font loading failures.

The safe integration shape is progressive enhancement: render normal accessible text first, then render Tegaki only when the text, language, glyph coverage, length, and reduced-motion state allow it.

### 2. Can Tegaki animate dynamic text that changes when the user clicks Next?

Yes.

`TegakiRenderer` takes text as React children or a `text` prop, and Tegaki also supports streaming text updates. For this app, the dynamic trigger should be `sentence?.id` plus `sourceLanguage`, because clicking `Next` changes the sentence and changing source language changes which field is displayed.

Recommended implementation detail: give the Tegaki renderer a key like:

```tsx
key={`${sentenceId}:${language}:${text}`}
```

That forces a fresh uncontrolled animation when the displayed source sentence changes.

### 3. Does Tegaki handle wrapping/layout well enough for source sentences?

Probably, but it needs a real visual proof in this app.

Tegaki's rendering guide says it handles text layout and line wrapping. However, the current source sentence layout is intentionally narrow (`16ch` to `21ch`) with large display type. Tegaki's measured layout needs to match that card behavior closely enough that the sentence does not jump, clip, or overflow while animating.

The implementation should reserve stable block space and keep the normal text fallback in the DOM. Use the same max-width and font-size constraints on the Tegaki container as the current `.source-sentence`.

### 4. What happens with long sentences?

Long sentences are the biggest UX risk.

Handwriting animation duration scales with the amount of stroke data. For long Russian or Vietnamese sentences, writing every glyph can make the learner wait before reading, which conflicts with the study flow. Long sentences also wrap across multiple lines, making the animated path visually busier.

Recommendation:

- Animate only short source sentences by default.
- Use static text for sentences over a threshold.
- Keep the existing Anime.js opacity/translate source-change cue as the fallback for long text.

Practical threshold:

- Phase 1: animate only when `text.length <= 55`.
- Allow testing up to `70` because the existing app already uses `> 70` for long source styling.
- Disable Tegaki above `70` unless manual QA proves it still feels fast and readable.

### 5. Which built-in font can be used for English only?

Use `tegaki/fonts/caveat` first.

Reasons:

- It is a built-in Latin bundle.
- It is more readable than the very decorative Latin script options.
- Tegaki docs list Latin built-in bundles as small relative to non-Latin bundles.
- It fits the calm handwritten study-card direction better than `italianno`, `tangerine`, or `parisienne`.

### 6. Are built-in fonts enough for Russian or Vietnamese?

No.

The built-in list does not include a Cyrillic or Vietnamese bundle. Even when a source TTF contains extra glyphs, Tegaki handwriting requires generated stroke data for the relevant characters. Unsupported characters should not be trusted to animate correctly.

The built-in `caveat` bundle is useful for English PoC only. It should not be treated as Russian/Vietnamese support.

### 7. If not, what custom font bundle would be needed?

For a universal strategy, generate one custom bundle from a Google Font that covers:

- Basic Latin for English.
- Cyrillic uppercase/lowercase used by the Russian deck.
- Vietnamese precomposed Latin letters used by the Vietnamese deck.
- Punctuation used in sentences: period, comma, question mark, apostrophe, hyphen, spaces, and any future quote characters.

Best bundle strategy:

- Build a character set from the actual sentence deck.
- Add a small safety alphabet for each supported language.
- Keep the bundle scoped to source-sentence content, not all possible Unicode.

Do not generate a broad all-script bundle unless necessary. Tegaki docs warn that large source fonts can make bundles large; `klee-one` is cited at around 7 MB because of thousands of CJK glyphs.

Better production option: generate smaller per-language bundles. English can start with built-in `caveat`; Russian can use a Cyrillic-focused custom `Bad Script` bundle; Vietnamese can use a custom `Pangolin` or `Playpen Sans` bundle if visual QA confirms clearer diacritics.

### 8. Which Google Font should be considered for English + Russian + Vietnamese?

Primary universal-bundle candidate: `Bad Script`.

I checked temporary Google Fonts TTF files against the five requested sentence states on 2026-07-03. Results:

| Font | Approx TTF size checked | English | Russian | Vietnamese | Notes |
| --- | ---: | --- | --- | --- | --- |
| Caveat | 245 KB | OK | OK | Missing Vietnamese letters | Good English/Russian look, not enough for Vietnamese |
| Bad Script | 176 KB | OK | OK | OK | Best first custom-bundle candidate |
| Pangolin | 575 KB | OK | OK | OK | Readable, larger, more playful |
| Playpen Sans | 688 KB | OK | OK | OK | Broad and readable, larger, less handwritten-card specific |
| Neucha | 104 KB | OK | OK | Missing Vietnamese letters | Not enough |
| Mali | 102 KB | OK | Missing Russian | OK | Not enough |
| Patrick Hand | 149 KB | OK | Missing Russian | OK | Not enough |
| Gloria Hallelujah | 44 KB | OK | Missing Russian | Missing Vietnamese letters | Not enough |
| Kalam | 417 KB | OK | Missing Russian | Missing Vietnamese letters | Not enough |
| Handlee | 36 KB | OK | Missing Russian | Missing Vietnamese letters | Not enough |

`Bad Script` is the best first candidate because it covered all tested English, Russian, and Vietnamese characters while staying smaller than `Pangolin` and `Playpen Sans` in this check. It is script-like, so the final decision should still include visual QA for Vietnamese diacritics and Russian readability.

Backup candidate: `Pangolin`. It is less cursive and likely more legible for learners, but it is larger and more playful.

### 8a. Can we use 2-3 different fonts instead of one universal font?

Yes. This is likely the better production direction.

Tegaki does not require a single font for every renderer instance. `TegakiRenderer` receives a `font` bundle prop, so `HandwrittenSourceSentence` can choose a bundle from `sourceLanguage`:

```ts
const sourceHandwritingFonts: Record<LanguageCode, TegakiBundle> = {
  en: caveatBundle,
  ru: badScriptRuBundle,
  vi: pangolinViBundle,
};
```

Why per-language bundles are attractive:

- Each language can use the most legible handwriting style for its script.
- English can use the built-in `caveat` bundle without waiting for custom generation.
- Russian can use a Cyrillic-friendly custom bundle.
- Vietnamese can use a less cursive custom bundle with clearer stacked diacritics.
- Bundles can be lazy-loaded by current source language instead of loading one larger all-language bundle up front.
- Glyph coverage metadata is simpler because each bundle only needs to cover one source language plus common punctuation.

Tradeoffs:

- The source sentence's handwriting style changes when the user changes source language.
- More generated bundle files must be managed and tested.
- Per-language font-size and line-height tuning may be needed because handwriting fonts have different metrics.
- A sentence containing mixed-language text may still need fallback or a broader bundle.

Recommended per-language candidates:

| Source language | Recommended first font | Bundle type | Reason |
| --- | --- | --- | --- |
| English | `Caveat` | Built-in first, custom optional | Good built-in Latin handwriting and lowest implementation risk |
| Russian | `Bad Script` | Custom Cyrillic bundle | Covered tested Russian text and feels naturally script-like for Cyrillic |
| Vietnamese | `Pangolin` or `Playpen Sans` | Custom Vietnamese bundle | Less cursive than `Bad Script`, likely clearer for stacked Vietnamese diacritics |

Vietnamese should not use a highly decorative cursive font until manually checked. The learner has to distinguish diacritics quickly, so legibility is more important than matching the Russian handwriting mood.

Best implementation model:

```ts
async function loadSourceHandwritingBundle(language: LanguageCode) {
  if (language === "en") {
    return import("tegaki/fonts/caveat");
  }

  if (language === "ru") {
    return import("../assets/tegaki/bad-script-ru/bundle");
  }

  return import("../assets/tegaki/pangolin-vi/bundle");
}
```

This avoids making the English PoC wait for every custom font. It also prevents users who only practice one source language from paying for unrelated bundles immediately.

Decision update: prefer the per-language bundle strategy over one universal `Bad Script` bundle, unless implementation simplicity is more important than typography quality. A single universal `Bad Script` bundle remains a valid fallback plan because it covered all tested sample characters.

### 9. What is the expected bundle size/performance risk?

Risk is moderate.

Known facts:

- `tegaki` npm metadata showed an unpacked package size of about 41 MB, likely because it ships built-in font assets.
- Tegaki docs say Latin bundles are roughly 250 to 400 KB.
- Larger script fonts can be much bigger; docs cite `klee-one` around 7 MB.
- The downloaded candidate TTFs ranged from 176 KB for `Bad Script` to 688 KB for `Playpen Sans`.

Each custom generated Tegaki bundle will include glyph stroke data plus the source TTF fallback. A single English/Russian/Vietnamese `Bad Script` bundle is probably acceptable if loaded only for the source sentence, but per-language bundles are cleaner: English can use the built-in bundle, Russian can load only the Cyrillic bundle, and Vietnamese can load only the Vietnamese-diacritic bundle.

Performance risks:

- Initial JS and asset payload increase.
- Font TTF fetch and parse.
- Stroke layout and animation cost for long sentences.
- Recreating the renderer every `Next` click.
- Potential mobile cost when animating many strokes at large font sizes.

Mitigations:

- Lazy-load Tegaki and only the current source-language bundle when animation is enabled.
- Use static text for long sentences.
- Disable for reduced motion.
- Avoid glow, wobble, gradients, or decorative effects.
- Prefer `time={{ mode: "uncontrolled", speed: 2 }}` or CSS time after testing, not slow default writing.

### 10. What fallback should be used if a sentence contains unsupported glyphs?

Fallback to the existing normal text blockquote.

The app must not show partial handwriting mixed with missing or static fallback glyphs for core learning content. A wrapper component should decide before rendering Tegaki:

```ts
canAnimate =
  !disabled &&
  !reducedMotion &&
  text.length <= threshold &&
  languageIsSupported &&
  allCharactersSupportedBySelectedBundle;
```

If false, render the current blockquote text and use the existing source-change animation.

For accessibility and reliability, even when Tegaki renders visually, keep a normal text copy available for screen readers and fallback.

### 11. How should this behave with `prefers-reduced-motion`?

If `prefersReducedMotion` is true, do not render animated Tegaki.

Use the existing `usePrefersReducedMotion()` hook. Reduced-motion users should receive the normal source sentence immediately. Do not hide text and do not play a shortened handwriting effect.

### 12. Should handwriting animation play every time the sentence changes, or only on first appearance?

Play it on sentence changes only when it will not slow practice.

Recommended behavior:

- Play on first appearance of an eligible short sentence.
- Play after `Next` when a new eligible short sentence appears.
- Play after source-language/filter changes if the resulting sentence is eligible.
- Do not replay on reveal/hide.
- Do not replay while the user types.
- Do not loop.

Add an implementation escape hatch:

```ts
playMode?: "change" | "first-only" | "off";
```

Default should be `"change"` for the PoC, but the final app may prefer `"first-only"` if repeated handwriting becomes tiring.

## Evaluation Of Requested Sentence States

The attached request showed mojibake for Russian and Vietnamese. The table below evaluates the intended Unicode text.

| State | Tegaki built-in Caveat | Preferred per-language bundle | UX recommendation |
| --- | --- | --- | --- |
| Short English: "The meeting starts at nine." | Good | Built-in Caveat | Animate in Phase 1 |
| Short Russian: "Встреча начинается в девять часов." | Not safe with built-in bundle | Custom Bad Script Russian bundle | Animate only after custom bundle |
| Short Vietnamese: "Tôi muốn học tiếng Nga mỗi ngày." | Not safe; full Caveat TTF missed `ế`, `ố`, `ỗ` | Custom Pangolin or Playpen Sans Vietnamese bundle | Animate only after custom bundle and diacritic QA |
| Long Russian: "Я хочу заниматься русским языком каждый день, даже если у меня мало свободного времени." | Not safe with built-in bundle | Custom Bad Script Russian bundle | Prefer static fallback because it is long |
| Long Vietnamese: "Tôi muốn luyện dịch mỗi ngày, ngay cả khi hôm đó tôi chỉ có một ít thời gian rảnh." | Not safe; full Caveat TTF missed several Vietnamese letters | Custom Pangolin or Playpen Sans Vietnamese bundle | Prefer static fallback because it is long and diacritic-heavy |

## Component Design

Proposed component:

```tsx
type HandwrittenSourceSentenceProps = {
  text: string;
  language: LanguageCode;
  sentenceId: string;
  disabled?: boolean;
  reducedMotion: boolean;
};
```

Optional internal props/config:

```ts
type HandwritingConfig = {
  maxAnimatedChars: number;
  playMode: "change" | "first-only" | "off";
  speed: number;
};
```

Render decision:

```tsx
function HandwrittenSourceSentence({
  text,
  language,
  sentenceId,
  disabled = false,
  reducedMotion,
}: HandwrittenSourceSentenceProps) {
  const canAnimate = shouldUseTegaki({
    text,
    language,
    disabled,
    reducedMotion,
  });

  if (!canAnimate) {
    return <blockquote className={sourceSentenceClass}>{text}</blockquote>;
  }

  return (
    <div className="source-sentence source-sentence--tegaki">
      <span className="sr-only">{text}</span>
      <TegakiRenderer
        key={`${sentenceId}:${language}:${text}`}
        font={bundleForLanguage(language)}
        time={{ mode: "uncontrolled", speed: 2, loop: false }}
        aria-hidden="true"
      >
        {text}
      </TegakiRenderer>
    </div>
  );
}
```

Implementation note: the exact element type can stay `blockquote` if Tegaki supports the needed semantics cleanly. If it renders a `div`, wrap it in a semantic container and keep accessible text.

## Font And Bundle Strategy

Phase 1:

- Install `tegaki`.
- Import `tegaki/fonts/caveat`.
- Animate English source sentences only.
- Add Vite `optimizeDeps.exclude: ["tegaki"]`.

Phase 2:

- Generate custom per-language bundles with Tegaki Studio/generator.
- Use `Bad Script` first for Russian.
- Use `Pangolin` or `Playpen Sans` first for Vietnamese, with manual diacritic legibility QA deciding between them.
- Keep English on built-in `caveat` unless visual QA shows it needs a custom English subset.
- Character set source for each custom bundle:
  - all unique characters from `public/data/sentences.json` after the data encoding is confirmed,
  - the relevant source language alphabet,
  - Vietnamese lowercase/uppercase precomposed letters for the Vietnamese bundle,
  - Russian Cyrillic uppercase/lowercase for the Russian bundle,
  - punctuation.
- Store generated bundles under project paths such as:
  - `src/assets/tegaki/bad-script-ru/`
  - `src/assets/tegaki/pangolin-vi/`

Phase 3:

- Add bundle coverage metadata.
- Route:
  - English: built-in Caveat.
  - Russian: custom Bad Script.
  - Vietnamese: custom Pangolin or Playpen Sans.
  - Unsupported glyphs: normal text.
- Lazy-load bundles by source language so the app does not fetch Russian/Vietnamese handwriting assets for an English-only session.

Do not use `harfbuzzjs` in Phase 1. English/Russian/Vietnamese in this app do not require complex shaping like Arabic or Indic scripts. Consider Harfbuzz later only if a selected cursive font requires ligatures/contextual alternates to look correct or if bundle generation uses extra subset fonts.

## CSS And Layout Changes Needed

Keep the current source sentence sizing contract. The Tegaki container should inherit or mirror:

- `max-width`
- `font-size`
- `line-height`
- `overflow-wrap`
- `text-wrap`
- text color

Likely CSS additions:

```css
.source-sentence--tegaki {
  display: block;
}

.source-sentence--tegaki [data-tegaki],
.source-sentence--tegaki svg,
.source-sentence--tegaki canvas {
  max-width: 100%;
}
```

Exact selectors depend on Tegaki's rendered DOM. Do not pre-hide `.source-sentence` in CSS. If the library fails to load, text should remain visible.

## Animation Timing

Recommended defaults:

- English PoC speed: `2` to `3`, no loop.
- Target total perceived duration for short sentence: about `700ms` to `1400ms`.
- Hard stop threshold: do not handwriting-animate above `70` characters.
- Preferred threshold: animate only `<= 55` characters unless testing shows longer still feels calm.

If Tegaki's computed timeline is available through `computeTimeline(text, font)`, use it in a guard:

```ts
const { totalDuration } = computeTimeline(text, font);
if (totalDuration > 1.6) fallbackToStaticText();
```

This is better than character count alone because glyph complexity varies.

## Accessibility

Rules:

- Source sentence must be readable immediately or almost immediately.
- Keep real text available to assistive tech.
- Mark the visual Tegaki layer `aria-hidden="true"` if a separate screen-reader text copy exists.
- Respect `prefers-reduced-motion`.
- Do not animate target/revealed answer in this phase.
- Do not animate all UI text.
- Do not delay the `Reveal` and `Next` actions.
- Do not make the user wait for handwriting to finish before typing.

Recommended behavior while animating:

- The normal text fallback can remain visually present underneath with low-risk styling, or the Tegaki layer can replace it only after the renderer is ready.
- Avoid a blank source area.
- The textarea should remain usable immediately.

## Performance Risks

Main risks:

- `tegaki` adds a large installed package footprint.
- Built-in font imports can pull font assets.
- Custom bundle generation can create large JSON/TTF assets if the character set is too broad.
- Dynamic remounting on every `Next` can create layout and animation work.
- Long Russian/Vietnamese strings can produce too many strokes.

Mitigation plan:

- Lazy-load `HandwrittenSourceSentence`.
- Lazy-load only the needed font bundle.
- Start with English-only built-in bundle.
- Use a character and duration threshold.
- Prefer static text on mobile if performance is poor.
- Run `npm run build` and check output chunk sizes before accepting Phase 2.

## Step-By-Step Implementation Plan

1. Add `tegaki` dependency.
2. Add Vite `optimizeDeps.exclude: ["tegaki"]`.
3. Create `HandwrittenSourceSentence`.
4. Render it from `PracticeCard` in place of the raw source blockquote, but preserve source text classes and fallback behavior.
5. Use `usePrefersReducedMotion()` from the existing hook.
6. Phase 1 guard: only animate `language === "en"` and `text.length <= 55`.
7. Import built-in `tegaki/fonts/caveat`.
8. Use a renderer key in the form `${sentenceId}:${language}:${text}` to replay on eligible source changes.
9. Keep existing Anime.js source-change animation for fallback paths.
10. Manually QA desktop and mobile.
11. Generate a custom `Bad Script` bundle for Russian.
12. Generate a custom Vietnamese bundle with `Pangolin` first, then compare `Playpen Sans` if diacritics need more clarity.
13. Add lazy-loading and glyph coverage checks before rendering Tegaki for Russian/Vietnamese.
14. Re-test bundle size, mobile performance, wrapping, and reduced motion.

## Manual Test Checklist

Test app states:

- Initial load with intro already seen and not seen.
- Source English, target Russian.
- Source Russian, target English.
- Source Vietnamese, target Russian.
- `Next` several times across short and long sentences.
- Filter changes that replace the current sentence.
- Reveal, hide, then next.
- Empty filter result if possible.
- Mobile width around 390px.
- Desktop width around 1440px.
- Browser with `prefers-reduced-motion: reduce`.

Specific checks:

- Source sentence is never blank.
- User can start typing immediately.
- Long sentences are static and readable.
- Vietnamese diacritics render clearly and do not collide badly.
- Russian glyphs are legible enough for learning.
- Animation does not replay on reveal/hide.
- No console font 404s in Vite dev.
- Build output is acceptable.

## Alternative Uses If Source Sentence Feels Wrong

If source-sentence handwriting proves too slow or fragile, Tegaki is still useful in less critical places:

1. Intro loading message: "Only for you".
2. Small deck/session title.
3. Empty state message.
4. Short English-only target reveal experiment.
5. Achievement/completion note after a practice session.
6. Decorative handwritten label, never core learning content.

Best fallback alternative for the source sentence itself: keep the current normal text and use the existing subtle Anime.js opacity/translate/blur change cue. That approach already fits the app, supports every glyph the browser can render, and avoids blocking study flow.

## Final Decision

Tegaki should be treated as a promising progressive enhancement, not a guaranteed replacement for the source sentence.

Proceed with Phase 1 English-only PoC using built-in `caveat`. For production, prefer 2-3 source-language-specific bundles instead of one universal font:

- English: built-in `caveat`.
- Russian: custom `Bad Script`.
- Vietnamese: custom `Pangolin` first, with `Playpen Sans` as the legibility backup.

Do not enable handwriting for Russian or Vietnamese until their custom bundles are generated and verified. Keep normal text as the canonical source sentence at all times, and disable handwriting for reduced motion, unsupported glyphs, and long sentences.
