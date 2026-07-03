# Tegaki Font Candidate Preview Plan

## Goal

Compare the remaining generated Tegaki font bundle candidates for source sentence handwriting animation without integrating them into the app yet.

Candidates:

1. `Bad Script`
2. `Cormorant Garamond`
3. `Lora`

## Sample Sentences

Use every generated font with every sample below.

English:

```text
The meeting starts at nine.
```

Russian:

```text
Встреча начинается в девять часов.
Я пью чай утром.
```

Vietnamese:

```text
Tôi uống trà vào buổi sáng.
Tôi muốn học tiếng Nga mỗi ngày.
```

Long fallback samples:

```text
Я хочу заниматься русским языком каждый день, даже если у меня мало свободного времени.
Tôi muốn luyện dịch mỗi ngày, ngay cả khi hôm đó tôi chỉ có một ít thời gian rảnh.
```

The attached prompt contained mojibake-looking Russian and Vietnamese strings. Use the Unicode strings above, which match the parsed sentence data.

## Evaluation Criteria

Score each font from `1` to `5` for:

- Serious/elegant fit
- Readability
- Vietnamese diacritic clarity
- Russian letter clarity
- Stroke animation naturalness
- Bundle size
- Whether it feels too childish
- Whether it feels too wedding/calligraphy
- Whether it feels too generic serif

## Preview Procedure

1. Generate the remaining three bundles in Tegaki Studio using `src/assets/tegaki/charsets/source-all.txt`.
2. Keep bundles in `src/assets/tegaki/candidates/*`.
3. Create a temporary preview route or local test component only after the bundles are present.
4. Render each font at the same source-sentence font size and max width as `.source-sentence`.
5. Test desktop and mobile widths.
6. Test speed values `3`, `5`, and `10`.
7. Do not replace the current built-in Caveat spike during preview.
8. Do not enable Russian or Vietnamese in production until a final font is chosen.

## Candidate Notes

`Bad Script`:

- Likely strongest first look for Russian.
- Watch for Vietnamese diacritic collisions and long-sentence readability.

`Cormorant Garamond`:

- Strong match for editorial paper style.
- Not pure handwriting, so judge whether Tegaki stroke animation feels natural enough.

`Lora`:

- Serious literary tone and likely good readability.
- Watch for feeling too generic serif rather than handwritten.

## Recommended First Preview Order

Preview these two first:

1. `Bad Script`
2. `Cormorant Garamond`

Reason: `Bad Script` is the most promising handwriting candidate for Russian, while `Cormorant Garamond` is the strongest fit for the current editorial paper style.
