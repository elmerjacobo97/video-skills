---
name: video-promo
description: "Make a 1080x1920 vertical promo video (TikTok/Reels) for a product, site, or new feature, using the promoted product's own brand (colors, font, logo) instead of the user's, with scenes authored one by one so each video moves differently. Use when the user asks for an ad, promo, or launch video of a project or URL. Renders with HyperFrames."
license: MIT
metadata:
  author: elmerjacobo97
---

# video-promo

Builds a vertical promo MP4 for a product, site, or feature. The **brand belongs to the promoted product** and is extracted fresh for each video into `brand.json`. Scenes are authored by hand following `video-motion` (varied motion, transitions, camera, and sound); there is no fixed generator. For developer content in the user's own brand, use `video-tiktok`.

Load `video-motion` first and follow its workflow; this file adds what is specific to promos.

- `VIDEOS` = `/Volumes/T7SHIELD/Projects/videos`. Every video goes in `VIDEOS/YYYY-MM-DD-<topic>/`, whichever project invoked the skill.
- `SKILL` = this skill's folder (the "Base directory" you receive when loading it).
- On-screen text is in the video's language, Spanish by default.

## Steps

1. **Folder.** Create `VIDEOS/YYYY-MM-DD-<topic-in-kebab>/`. If it exists, ask before overwriting.
2. **Source material.**
   - Site: `mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes capture "<URL>" -o ./capture --json; rm -rf .tmp`. Read `capture/extracted/visible-text.txt` and `tokens.json`, and view `capture/assets/contact-sheet-*.jpg` to pick screenshots.
   - Local project (a feature, or the whole product): read the code and screenshots of the repo that invoked you; take colors and font from its CSS or Tailwind config.
3. **Brand.** Write `<folder>/brand.json` (format and where to find each value: `references/brand.md`). Copy the font files, logo, and icon into the folder. **Show the brand to the user and wait for corrections before building.**
4. **Scope.** One feature, or the whole product? For the whole product, pick the 2–3 strongest functions and confirm them with the user; if there are more, suggest a series of short videos with the same `brand.json`.
5. **Scenes.** Follow `video-motion`: hook, style, scene plan table (approved by the user), build, verify. Copy the chosen screenshots to `<folder>/assets/img/`. Use only real text, figures, and screens from the product; never invent clients, testimonials, or prices.
6. **Render.**
   ```bash
   mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes render --quality high --output renders/<topic>-9x16.mp4; rm -rf .tmp
   ```
   One render per format: overwrite, do not accumulate `-v2`.
7. **Deliver.** MP4 path, real duration (`ffprobe`), and a publishing kit: title, description, 5 hashtags.

## Promo structure

- 15–25 s, 4 to 6 scenes: hook, 1–3 features (one benefit sentence each, max 15 words), closing with the real URL or handle.
- The hook speaks to the viewer's pain or desired result, not to the product name.
- Screenshots: prefer real product screens with large readable elements; avoid tiny text. Show them in motion (depth, camera, scroll) rather than as static images.
- Brand colors come only from `brand.json`; never use the user's personal brand (lime on black) unless asked.
- Make sure text over a screenshot or gradient keeps AA contrast.

## Working rules

- Never commit. Before overwriting a project or render, confirm with the user.
- `index.html` and `compositions/` are authored per video; keep scene files small and named by scene (`01-hook.html`, `02-leads.html`).
- Keep TikTok safe zones (`video-motion` → `references/tiktok-format.md`).
