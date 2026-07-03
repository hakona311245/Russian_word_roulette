# Tegaki Studio Generation Guide

## Why Studio Is Required

The installed `tegaki` package exposes a CLI, but `npx tegaki --help` shows that it is an animated SVG generator only. It accepts text plus a bundled font name and writes SVG output. It does not generate importable font bundles.

The installed package also does not include a callable `tegaki-generator` dependency or an official local bundle-generation CLI. The package README says custom fonts should be created with the interactive Studio.

Use Tegaki Studio for these custom bundle candidates:

<https://gkurt.com/tegaki/studio/>

## Font Candidates

Generate one universal candidate bundle for each remaining font:

1. `Bad Script`
2. `Cormorant Garamond`
3. `Lora`

`Comforter` and `Playpen Sans` were removed from the current candidate set.

Do not use `Pangolin` unless these three fail visually.

`Great Vibes` is rejected for now because it is too decorative and wedding-like for source sentences.

## Charset

Paste the exact contents of this file into Tegaki Studio:

`src/assets/tegaki/charsets/source-all.txt`

Current count: 257 unique characters.

The charset combines:

- `src/assets/tegaki/charsets/en.txt`
- `src/assets/tegaki/charsets/ru.txt`
- `src/assets/tegaki/charsets/vi.txt`

It includes spaces, punctuation found in the sentence data, Russian safety alphabet characters, and Vietnamese safety alphabet characters.

## Recommended Studio Settings

Use default-safe settings first:

- Resolution: `400`
- Skeleton method: `zhang-suen`
- Line cap: `round`
- Bezier tolerance: `0.5`
- RDP tolerance: `1.0`

If Studio supports weight/style selection:

- `Bad Script`: regular `400`
- `Cormorant Garamond`: regular `500` if possible, otherwise `400`
- `Lora`: regular `400`, or `500` if `400` feels too light

## Output Folders

Save each downloaded bundle into the matching folder:

- `src/assets/tegaki/candidates/bad-script/`
- `src/assets/tegaki/candidates/cormorant-garamond/`
- `src/assets/tegaki/candidates/lora/`

After Studio export and extraction, each folder should contain the downloaded bundle files, including an importable `bundle` entry or equivalent.

## Post-Download Checks

After downloading each bundle:

1. Confirm the folder contains a bundle entry file.
2. Confirm the bundle imports in TypeScript without changing app rendering.
3. Confirm the bundle includes a source font file or URL expected by Tegaki.
4. Record folder size.
5. Do not wire the bundle into `HandwrittenSourceSentence` yet.
