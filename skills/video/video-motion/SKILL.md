---
name: video-motion
description: "Shared method for authoring vertical videos (TikTok/Reels) scene by scene in HyperFrames, with varied motion, transitions, camera, and sound instead of a fixed template. Use together with video-tiktok or video-promo, or whenever a short vertical video needs its motion designed rather than generated."
license: MIT
metadata:
  author: elmerjacobo97
---

# video-motion

Method for building a short vertical video by hand, one scene at a time, so that each video moves differently. Brand tokens stay fixed (colors, fonts, safe zones); **motion, transitions, camera, and sound are chosen per video**.

This skill does not re-teach HyperFrames. It decides *what* to build and enforces variety; the HyperFrames skills say *how*:

| Need | Skill |
| --- | --- |
| Composition contract (clips, tracks, sub-compositions, determinism) | `hyperframes-core` (read first) |
| Motion rules, blueprints, transitions, text effects, runtimes | `hyperframes-animation` |
| Camera moves, punch-ins, 3D depth | `hyperframes-keyframes` |
| Ready-made blocks and effects (glitch, shimmer, charts, code windows) | `hyperframes-registry` |
| Sound effects and assets | `media-use` |
| CLI (`check`, `snapshot`, `render`) | `hyperframes-cli` |

Brand and output folder come from the calling skill: `video-tiktok` (user's brand) or `video-promo` (the promoted product's brand).

## Workflow

0. **Prerequisites.** Confirm that `hyperframes-core`, `hyperframes-animation`, `hyperframes-keyframes`, and `hyperframes-registry` are available (listed among your skills, or present under `~/.claude/skills` or `~/.agents/skills`). If any is missing, stop and tell the user to install the HyperFrames plugin: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`, and restart Claude Code. `media-use` is optional: without it, use only the sounds bundled by the calling skill or make the video silent. If a rule or blueprint named in `references/styles.md` is missing from the installed version, pick an equivalent from `rules-index.md` or `blueprints-index.md`.
1. **Brief.** Topic, audience, one-sentence promise, and the hook (pain, contrast, or result). Propose 3 hooks unless the user gave one.
2. **Style.** Pick one style from `references/styles.md` that fits the topic and the brand. Say which and why in one line.
3. **Scene plan.** Show the user a short table, one row per scene, before building:

   | # | Message (≤ 15 words) | Entrance | Camera | Transition out | Sound |
   | --- | --- | --- | --- | --- | --- |

   Add the total duration under the table (scenes × 4–5 s) and check it against the ranges in `references/tiktok-format.md`. Apply the variety rules below to the table. Wait for approval or corrections.
4. **Build.** One sub-composition per scene in `compositions/`, mounted from `index.html` (see `hyperframes-core` → sub-compositions). Reuse registry blocks before hand-building a named effect. Brand tokens go in shared CSS variables.
5. **Verify.** `npx hyperframes check`, then `snapshot` at each scene's midpoint and read the contact sheet. Optionally audit choreography with the animation map script of `hyperframes-animation`.
6. **Render and deliver** as defined by the calling skill.

## Variety rules

Apply them to the scene plan, not after the fact.

- No two consecutive scenes share the same entrance or the same transition.
- Use at least 3 distinct techniques per video (for example: kinetic text, 3D depth, a camera move, a counter, a typed command).
- At most one signature effect (glitch, 3D flight, morph) per video; it must carry meaning, not decorate.
- Do not reuse the exact scene plan of the previous video in the same folder tree: check `videos/` for the last few and change the style or the technique mix.
- Motion serves the message: if an effect does not make the sentence easier to read or remember, drop it.
- Keep it light: few moving things at a time. A clear hook beats a busy frame.

## Fixed (never varied)

- TikTok format and text limits: `references/tiktok-format.md`.
- Brand tokens given by the calling skill.
- Real content only: no invented figures, clients, testimonials, commands, or outputs.
- No music inside the video; the user adds it in TikTok.
- Never start servers (`preview`, `dev`); verify with `check` and `snapshot`.
- Sound rules: `references/sound.md`.
