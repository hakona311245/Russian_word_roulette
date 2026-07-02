# Text Writing Animation Guide for Websites

Use this guide when implementing text that feels like it is being written, typed, composed, or revealed on a website.

The goal is not to animate the whole screen. The goal is to make selected text feel intentionally revealed through timing, masking, cursor behavior, and sequencing.

---

## Core Principle

A convincing “written out” effect comes from:

1. Controlled reveal
2. Human-like pacing
3. Cursor or pen-like visual cue
4. Small pauses after punctuation
5. Restraint

Do **not** type or animate every paragraph on the page. Use the effect only on high-impact text such as:

- Hero headlines
- Short slogans
- Product value propositions
- Section intros
- Assistant/chat style responses
- Logo/signature text
- Important callout lines

For body text, prefer word-by-word reveal or simple fade/slide-in.

---

## Recommended Pattern by Use Case

| Use case | Best technique |
|---|---|
| Short hero headline | CSS typewriter or soft mask reveal |
| Dynamic text from JS/API | JavaScript typing effect |
| Paragraph or long sentence | Word-by-word reveal |
| Scroll section reveal | IntersectionObserver + class toggle |
| Premium/SaaS feel | Soft mask reveal |
| Handwritten logo/signature | SVG stroke drawing |
| React animation sequence | Motion or GSAP-style animation logic |

---

## Option 1: CSS Typewriter Effect

Use this for short, fixed text.

Best for:

- Hero headline
- Short slogan
- One-line CTA text

Avoid this for long paragraphs.

### HTML

```html
<h1 class="typewriter" style="--chars: 39;">
  Automate office work with AI agents.
</h1>
```

### CSS

```css
.typewriter {
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.08em solid currentColor;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  animation:
    typing 2.2s steps(var(--chars), end) forwards,
    caret 0.75s step-end infinite;
}

@keyframes typing {
  to {
    width: calc(var(--chars) * 1ch);
  }
}

@keyframes caret {
  50% {
    border-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter {
    width: auto;
    animation: none;
    border-right: none;
  }
}
```

### Notes

- `steps()` makes the animation reveal in discrete jumps.
- `1ch` works best with monospace fonts.
- With proportional fonts, the reveal width may not perfectly match the actual text width.
- This is good for a simple visual effect, but not the most realistic typing.

---

## Option 2: JavaScript Typing Effect

Use this when the text is dynamic, variable-length, or needs realistic pacing.

Best for:

- Chatbot-like UI
- Dynamic landing page copy
- Interactive demos
- Text loaded from API
- Type/delete/retype effects

### HTML

```html
<p class="typing-wrap">
  <span class="sr-only">Automate reports, emails, and internal workflows.</span>
  <span id="typed-text" aria-hidden="true"></span>
  <span class="cursor" aria-hidden="true"></span>
</p>
```

### CSS

```css
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: currentColor;
  margin-left: 3px;
  vertical-align: -0.1em;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    display: none;
  }
}
```

### JavaScript

```js
const text = "Automate reports, emails, and internal workflows.";
const target = document.querySelector("#typed-text");

let i = 0;

function typeNext() {
  target.textContent = text.slice(0, i);

  if (i < text.length) {
    i++;

    const char = text[i - 1];

    const delay =
      char === "," ? 220 :
      char === "." ? 350 :
      char === " " ? 40 :
      35 + Math.random() * 45;

    setTimeout(typeNext, delay);
  }
}

typeNext();
```

### Notes

- Add longer delay after punctuation.
- Add shorter delay after spaces.
- Randomize normal character delay slightly.
- Do not make every character appear at the same speed; it looks mechanical.
- Keep real text in the DOM for accessibility with `.sr-only`, while animated text is `aria-hidden`.

---

## Option 3: Soft Mask Reveal

Use this when text should feel elegant, smooth, or premium rather than literally typed.

Best for:

- SaaS landing pages
- Product intro text
- Elegant section headings
- Premium brand websites

### HTML

```html
<h2 class="soft-write">
  Your office tasks, handled automatically.
</h2>
```

### CSS

```css
.soft-write {
  display: inline-block;
  mask-image: linear-gradient(90deg, black 0%, black 50%, transparent 70%);
  mask-size: 220% 100%;
  mask-position: 100% 0;
  animation: softReveal 1.4s ease-out forwards;
}

@keyframes softReveal {
  to {
    mask-position: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .soft-write {
    animation: none;
    mask: none;
  }
}
```

### Notes

- This does not look like keyboard typing.
- It feels like ink, light, or focus moving across the text.
- It works better with proportional fonts than the `1ch` typewriter trick.

---

## Option 4: Word-by-Word Reveal

Use this for longer text. It is more readable than character typing.

Best for:

- Paragraph intros
- Feature descriptions
- Explainer copy
- About sections

### HTML

```html
<p class="word-reveal">
  <span>We</span>
  <span>build</span>
  <span>AI</span>
  <span>agents</span>
  <span>for</span>
  <span>office</span>
  <span>automation.</span>
</p>
```

### CSS

```css
.word-reveal span {
  opacity: 0;
  transform: translateY(0.4em);
  display: inline-block;
  animation: wordIn 0.45s ease-out forwards;
}

.word-reveal span:nth-child(1) { animation-delay: 0.05s; }
.word-reveal span:nth-child(2) { animation-delay: 0.12s; }
.word-reveal span:nth-child(3) { animation-delay: 0.19s; }
.word-reveal span:nth-child(4) { animation-delay: 0.26s; }
.word-reveal span:nth-child(5) { animation-delay: 0.33s; }
.word-reveal span:nth-child(6) { animation-delay: 0.40s; }
.word-reveal span:nth-child(7) { animation-delay: 0.47s; }

@keyframes wordIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .word-reveal span {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

### Notes

- Good for readability.
- Feels composed without slowing the user down.
- Better than character typing for medium or long copy.

---

## Option 5: Scroll-Triggered Reveal

Use this when text should animate only when it enters the viewport.

Best for:

- Landing page sections
- Feature cards
- Testimonials
- Case study blocks

Use `IntersectionObserver` instead of raw scroll listeners.

### HTML

```html
<section>
  <h2 data-write-reveal>
    Automate repetitive office work.
  </h2>
</section>
```

### CSS

```css
[data-write-reveal] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

[data-write-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-write-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### JavaScript

```js
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("[data-write-reveal]").forEach(el => {
  observer.observe(el);
});
```

### Notes

- This does not type letters.
- It creates a controlled introduction of content.
- It is usually better for page sections than literal typewriter animation.

---

## Option 6: SVG Handwriting Effect

Use this for handwritten logos, signatures, or decorative headings.

Best for:

- Signature animation
- Logo reveal
- Handwritten title
- Decorative stroke text

### CSS Concept

```css
.signature-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
```

### Notes

- The text usually needs to be converted into SVG paths.
- This is not good for normal editable website text.
- Use it for a small branding moment, not full paragraphs.

---

## Accessibility Requirements

Always support reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Better component-specific version:

```css
@media (prefers-reduced-motion: reduce) {
  .typewriter,
  .soft-write,
  .word-reveal span,
  [data-write-reveal] {
    animation: none;
    transition: none;
    transform: none;
    opacity: 1;
    width: auto;
    mask: none;
    border-right: none;
  }
}
```

For JavaScript typing, avoid making screen readers read every newly typed character. Prefer this pattern:

```html
<span class="sr-only">Full real text here.</span>
<span aria-hidden="true" id="typed-text"></span>
```

---

## Performance Guidelines

Do:

- Animate `opacity`, `transform`, `mask-position`, or width on small elements.
- Use `IntersectionObserver` for scroll-triggered animation.
- Keep effects short.
- Animate only selected text.
- Stop animation after it finishes.
- Avoid heavy layout recalculation.

Avoid:

- Typing entire paragraphs character by character.
- Animating hundreds of spans.
- Running scroll handlers every frame.
- Updating DOM too frequently.
- Using console logging during animation.
- Creating layout shifts while text is typing.

---

## Good Default Recommendation

For a clean modern website, use this combination:

```txt
Hero headline: CSS typewriter or soft mask reveal
Subheading: word-by-word reveal
Body text: normal fade/slide reveal
Scroll sections: IntersectionObserver
Logo/signature: SVG stroke drawing only if needed
```

Strong default:

- Use **soft mask reveal** for premium/professional websites.
- Use **JavaScript typing** for chatbot/product-demo feeling.
- Use **word-by-word reveal** for longer text.
- Use **CSS typewriter** only for short, fixed text.

---

## Implementation Instruction for Codex

When asked to implement this in an existing website:

1. First inspect the target text and decide whether it is:
   - short static text,
   - dynamic text,
   - paragraph text,
   - scroll-triggered section text,
   - decorative logo/signature text.

2. Pick the least complex implementation that fits:
   - CSS only for simple static text.
   - JavaScript for dynamic typing.
   - IntersectionObserver for scroll-triggered reveal.
   - SVG stroke only for decorative handwritten paths.

3. Add reduced-motion support.

4. Avoid animating large text blocks.

5. Preserve accessibility:
   - real text should be available to screen readers,
   - animated duplicate text should be `aria-hidden`,
   - do not force screen readers to announce every typed character.

6. Keep the animation subtle:
   - headline typing duration around `1.5s` to `2.5s`,
   - word reveal delay around `0.05s` to `0.09s` per word,
   - cursor blink around `0.7s` to `0.9s`,
   - punctuation pauses in JS typing around `200ms` to `400ms`.

---

## Decision Tree

```txt
Is the text short and fixed?
  Yes -> CSS typewriter or soft mask reveal.
  No -> continue.

Is the text dynamic or loaded from state/API?
  Yes -> JavaScript typing.
  No -> continue.

Is the text a paragraph?
  Yes -> word-by-word reveal or simple fade-in.
  No -> continue.

Should the effect start when scrolled into view?
  Yes -> IntersectionObserver trigger.
  No -> continue.

Is this a logo/signature/handwritten mark?
  Yes -> SVG stroke drawing.
  No -> use simple fade/slide reveal.
```

---

## Final Rule

The best “written out” effect is restrained.

Animate the important line. Let the rest of the page stay readable.
