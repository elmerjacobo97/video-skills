---
name: video-tiktok
description: "Generate a 1080x1920 vertical TikTok video with the elmerjacobo.dev brand from a topic, text, list of steps, or a site/project (ad). Use when the user asks for a video, a video tutorial, or an ad for TikTok. Renders with HyperFrames."
license: MIT
metadata:
  author: elmerjacobo97
---

# video-tiktok

Turns a topic into a vertical MP4 with the user's brand. The design lives in `scripts/generate.mjs` and `assets/brand.json`; you only write the content in `video.json`. The skill does not depend on any user folder: it works from any project.

- `VIDEOS` = `/Volumes/T7SHIELD/Projects/videos`. Every new video goes there, in `VIDEOS/YYYY-MM-DD-<topic>/`, no matter which project the skill was invoked from.
- `SKILL` = this skill's folder (the "Base directory" you receive when loading it).
- Video content (titles, text, captions) is written in the user's language, Spanish by default. This file and the references are in English.

## Steps

1. **Folder.** Create `VIDEOS/YYYY-MM-DD-<topic-in-kebab>/` with today's date. If it already exists, ask before overwriting. Horizontal variant: suffix `-16x9`.
2. **Content.** Write `<folder>/video.json`. Format and frame types: `references/video-json.md`. Use only what the user gave or what you verified (commands, versions, real outputs, site text). Never invent figures, clients, or testimonials.
3. **Generate.** `node SKILL/scripts/generate.mjs <folder>`. On failure, the message says what to fix in `video.json`.
4. **Check.** Inside the folder: `npx hyperframes check`. Fix every `✗`. `content_overlap` warnings on the footer during fades are expected.
5. **Review.** `npx hyperframes snapshot --at <midpoint of each frame>` and read `snapshots/contact-sheet.jpg`. Look for cut or overflowing text.
6. **Render.**
   ```bash
   mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes render --quality high --output renders/<topic>-9x16.mp4; rm -rf .tmp
   ```
   `TMPDIR` avoids the system disk's `Low disk space` error. One render per format: overwrite, do not accumulate `-v2`.
7. **Deliver.** MP4 path, real duration (`ffprobe`), and the publishing kit: title, description, and 5 hashtags. The description includes the search phrase (for example "cómo instalar pnpm en mac").

## Ad for a site or project

- Site: `mkdir -p .tmp && TMPDIR="$PWD/.tmp/" npx hyperframes capture "<URL>" -o ./capture --json; rm -rf .tmp`. Use `capture/extracted/visible-text.txt` and `capture/assets/`.
- Local project (a new feature): read the code and screenshots from the repo that invoked you. Copy only the images you use to `<folder>/assets/img/`.
- If the site or client has its own brand, do not force the user's: the ad may use the client's (see `references/brand.md`).

## Working rules

- Never start servers (`preview`, `dev`). Verify with `check` and `snapshot`.
- Never commit.
- Before deleting or overwriting an existing project or render, confirm with the user.
- Files in `compositions/frames/` and `index.html` are generated: do not hand-edit them; change `video.json` and regenerate.
- No music inside the video; the user adds it in TikTok ("Original sound" at max, music at 10–20 %).
- Sound: only typing while a command is written and a chime when there is output. No whoosh or pops.
- No big decorative background numbers. The step number goes only in the title ("1. With Node.js").

## Hook and retention

The video competes in the first 2 seconds.

- **Cover = hook + keyword.** The `title` speaks to the viewer: a pain ("¿Tu node_modules pesa gigas?"), a contrast ("Deja de usar npm install"), or a result ("pnpm en tu Mac con 1 comando"). Never a label that only describes the video.
- **The `subtitle` carries the search phrase**, in the words someone would type.
- **Deliver on the hook.** If the title names a problem, some frame solves it.
- **First command or first idea before second 5.** No intro frames or index.
- **Close with a one-word-answer question** ("¿npm, yarn o pnpm?").
- Propose 3 hooks (pain, contrast, result) and let the user choose, unless they already gave the title.

## Content rules

- 4 to 8 frames. Cover first, close last. Every frame must add something.
- Short titles, normal sentence case (never ALL CAPS).
- Do not repeat `elmerjacobo.dev` in the text: it is already in the header.

## Brand

Rules and colors: `references/brand.md`. The source of truth is `assets/brand.json`. To change it, edit that file and regenerate; for a new frame type, add it to `TYPES` in `scripts/generate.mjs`.
