---
name: video-promo
description: "Generate a 1080x1920 vertical promo video (TikTok/Reels) for a product, site, or new feature, using the promoted product's own brand (colors, font, logo) instead of the user's. Use when the user asks for an ad, promo, or launch video of a project or URL. Renders with HyperFrames."
license: MIT
metadata:
  author: elmerjacobo97
---

# video-promo

Turns a product, site, or feature into a vertical promo MP4 with 3D screenshot scenes. The motion and layout live in `scripts/generate.mjs`; the **brand belongs to the promoted product** and is extracted fresh for each video into `brand.json`. For developer content in the user's own brand, use `video-tiktok` instead.

- `VIDEOS` = `/Volumes/T7SHIELD/Projects/videos`. Every video goes in `VIDEOS/YYYY-MM-DD-<topic>/`, regardless of which project invoked the skill.
- `SKILL` = this skill's folder (the "Base directory" you receive when loading it).
- On-screen text (titles, text, CTA) is written in the video's language, Spanish by default. Files and keys are in English.

## Steps

1. **Folder.** Create `VIDEOS/YYYY-MM-DD-<topic-in-kebab>/`. If it exists, ask before overwriting.
2. **Source material.**
   - Site: `mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes capture "<URL>" -o ./capture --json; rm -rf .tmp`. Read `capture/extracted/visible-text.txt`, `capture/extracted/tokens.json`, and view `capture/assets/contact-sheet-*.jpg` to pick screenshots.
   - Local project (new feature): read the code and screenshots of the repo that invoked you; take colors and font from its CSS/Tailwind config.
3. **Brand.** Write `<folder>/brand.json` (format: `references/brand.md`) from the product's real colors, font, logo, and icon. Copy the font files, logo, and icon into the folder. **Show the brand to the user and wait for corrections before generating.**
4. **Content.** Copy the chosen screenshots to `<folder>/assets/img/`. Write `<folder>/video.json` (format: `references/video-json.md`). Use only real text from the product or the user. Never invent figures, clients, testimonials, or prices.
5. **Generate.** `node SKILL/scripts/generate.mjs <folder>`. On failure the message says what to fix.
6. **Check.** Inside the folder: `npx hyperframes check` (fix every `✗`), then `npx hyperframes snapshot --at <midpoint of each frame>` and read `snapshots/contact-sheet.jpg`. Look for text overlapping the screenshots.
7. **Render.**
   ```bash
   mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes render --quality high --output renders/<topic>-9x16.mp4; rm -rf .tmp
   ```
   One render per format: overwrite, do not accumulate `-v2`.
8. **Deliver.** MP4 path, real duration (`ffprobe`), and a publishing kit: title, description, 5 hashtags.

## Hook and structure

- 15–25 s, 4 to 6 frames: `cover` (hook) → 1–3 `feature` → `closing` (CTA).
- The `cover` title speaks to the viewer's pain or desired result, not to the product name. Propose 3 hooks (pain, contrast, result) unless the user already gave one.
- One feature per frame, one benefit sentence (max 15 words), one or two screenshots.
- `closing` repeats the promise and ends with the real URL or handle in `cta`.

## Working rules

- Never start servers (`preview`, `dev`). Verify with `check` and `snapshot`.
- Never commit. Before overwriting a project or render, confirm with the user.
- `compositions/frames/` and `index.html` are generated: change `video.json` or `brand.json` and regenerate.
- No music inside the video; the user adds it in TikTok.
- Keep TikTok safe zones: 12 % top, 25 % bottom, 8 % sides. The generator already respects them; do not add elements outside.
- Do not reuse the user's personal brand (lime on black) unless asked.
