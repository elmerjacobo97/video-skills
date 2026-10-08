# Sound

Sound effects are chosen per video, with restraint. The user's rule stands: effects only where they support a real action; too many effects feel like noise.

- Add a sound only for something that physically happens on screen: typing a command, a UI click or tap, a result appearing, an impact (a slam or a card landing).
- Never decorative: no whoosh on every transition, no pop on every element.
- Vary the set between videos (a soft click, a key tap, a low hit, a chime, a paper or card sound). Do not reuse the same pair every time.
- At most one sound per beat; keep a scene silent when the visuals already carry it.
- Levels: effects at 0.6–0.9 volume, no clipping. No music inside the video; the user adds it in TikTok ("Original sound" at max, music at 10–20 %).
- Place audio as `<audio>` clips with `data-start`, `data-duration`, `data-track-index` (see `hyperframes-core`), synced to the animation time, not approximated.

## Sources

1. The calling skill's bundled files, if any (`video-tiktok` ships `assets/sfx/keyboard-typing.mp3` and `success-chime.mp3`).
2. `media-use` → `resolve --type sfx` for a frozen local file (needs the `heygen` CLI).
3. If neither is available, make the video silent rather than inventing files. Say so in the delivery.

Check the license of any file before publishing it in a public repo.
