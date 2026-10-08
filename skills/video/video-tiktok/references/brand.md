# Brand

Source of truth: `assets/brand.json` (colors, fonts, closing texts). The generator already applies these rules; do not break them in generated frames.

- Background `#0B0B0B`, text `#F5F4EF`, lime accent `#D4FF3F`.
- Lime goes on titles, numbers, and keywords. Never as a full background; small highlight blocks are fine.
- Space Grotesk everywhere; Space Mono only for terminal commands.
- Titles in normal sentence case, never ALL CAPS.
- 4 px dot grid at 15 %, every 40 px.
- TikTok safe zones: 12 % top, 25 % bottom, 8 % sides.
- `elmerjacobo.dev` always lowercase, in the header of every frame (cover included), below the progress bar.
- Full-width progress bar, one segment per frame. No `2/6` counter.

## Ads with the client's brand

The generator only knows the user's brand. For an ad with the client's brand (site colors and font), build the video by hand in HyperFrames: capture the site, take colors and fonts from `capture/extracted/tokens.json`, and keep the TikTok safe zones. If this repeats, turn it into its own skill (`video-anuncio`) with its own generator.
