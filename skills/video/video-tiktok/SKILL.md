---
name: video-tiktok
description: "Make a 1080x1920 vertical TikTok video in the elmerjacobo.dev brand from a topic, text, list of steps, or comparison. Scenes are authored per video with varied motion and sound; a quick generator exists for plain terminal tutorials. Use when the user asks for a video, a video tutorial, or a tip video for TikTok. Renders with HyperFrames."
license: MIT
metadata:
  author: elmerjacobo97
---

# video-tiktok

Builds a vertical MP4 in the user's brand. The **brand is fixed** (colors, font, header, safe zones: `references/brand.md` and `assets/brand.json`); **motion, transitions, camera, and sound vary per video** following `video-motion`. The skill does not depend on any user folder: it works from any project.

Load `video-motion` first and follow its workflow (hook, style, scene plan, build, verify); this file adds what is specific to the user's content videos.

- `VIDEOS` = `/Volumes/T7SHIELD/Projects/videos`. Every video goes in `VIDEOS/YYYY-MM-DD-<topic>/`, whichever project invoked the skill. Horizontal variant: suffix `-16x9`.
- `SKILL` = this skill's folder (the "Base directory" you receive when loading it).
- On-screen text (titles, text, captions) is in the user's language, Spanish by default.

## Steps

1. **Folder.** Create `VIDEOS/YYYY-MM-DD-<topic-in-kebab>/`. If it exists, ask before overwriting.
2. **Content.** Use only what the user gave or what you verified (commands, versions, real outputs, site text). Never invent figures, clients, or testimonials. For an ad of a site or project, use `video-promo` instead.
3. **Pick the mode.**
   - **Authored (default):** follow `video-motion`, using this skill's brand tokens. Copy `assets/fonts/` to the video folder and define the colors from `assets/brand.json` as CSS variables. Keep the brand's fixed elements: header `elmerjacobo.dev`, full-width progress bar with one segment per scene, dot grid.
   - **Quick generator (plain terminal tutorials only):** write `video.json` (`references/video-json.md`) and run `node SKILL/scripts/generate.mjs <folder>`. It always produces the same look; use it only when a consistent, fast tutorial is what the user wants.
4. **Verify.** In the folder: `npx hyperframes check` (fix every `✗`; `content_overlap` on the footer during fades is expected), then `npx hyperframes snapshot --at <midpoint of each scene>` and read `snapshots/contact-sheet.jpg`. Look for cut or overflowing text.
5. **Render.**
   ```bash
   mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes render --quality high --output renders/<topic>-9x16.mp4; rm -rf .tmp
   ```
   `TMPDIR` avoids the system disk's `Low disk space` error. One render per format: overwrite, do not accumulate `-v2`.
6. **Deliver.** MP4 path, real duration (`ffprobe`), and the publishing kit: title, description, and 5 hashtags. The description includes the search phrase (for example "cómo instalar pnpm en mac").

## Hook and retention

The video competes in the first 2 seconds.

- **Cover = hook + keyword.** The title speaks to the viewer: a pain ("¿Tu node_modules pesa gigas?"), a contrast ("Deja de usar npm install"), or a result ("pnpm en tu Mac con 1 comando"). Never a label that only describes the video.
- **The subtitle carries the search phrase**, in the words someone would type.
- **Deliver on the hook.** If the title names a problem, some scene solves it.
- **First command or first idea before second 5.** No intro scenes or index.
- **Close with a one-word-answer question** ("¿npm, yarn o pnpm?").
- Propose 3 hooks (pain, contrast, result) and let the user choose, unless they already gave the title.

## Content that works for this account

From the user's TikTok analytics: short lists ("3 extensions I always install"), A-vs-B comparisons, and 3–4 step installs get the most views; news about new models and long explanations get the least. Favor those formats and keep tutorials under 40 s.

## Working rules

- Never start servers (`preview`, `dev`). Never commit.
- Before deleting or overwriting an existing project or render, confirm with the user.
- Keep the brand fixed (`references/brand.md`); everything else follows `video-motion`.
- Sound: `video-motion` → `references/sound.md`. Bundled effects in `assets/sfx/` may be used; vary them across videos.
- No big decorative background numbers. A step number goes only in the title ("1. With Node.js").
