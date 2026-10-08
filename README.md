[English](README.md) · [Español](README-es.md)

# Video Skills

Skills for generating videos with HyperFrames (HTML + GSAP rendered to MP4). Brand tokens are fixed; motion, transitions, camera, and sound are authored per video so videos do not look alike. Each skill carries its own references: none depends on a user folder. Requires the HyperFrames plugin skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-registry`).

## Skills

| Skill | Use |
| --- | --- |
| [`video-tiktok`](./skills/video/video-tiktok/SKILL.md) | Vertical 1080x1920 TikTok videos with the elmerjacobo.dev brand: tutorials, lists, and ads |
| [`video-motion`](./skills/video/video-motion/SKILL.md) | Shared method: scene-by-scene authoring with varied motion, transitions, camera, and sound; used by the other two |
| [`video-promo`](./skills/video/video-promo/SKILL.md) | Vertical promo videos of a product, site, or feature using the promoted product's own brand (colors, font, logo) |

## Which one to use

- **`video-tiktok`**: content in your own brand (tutorials, lists, comparisons). The brand is fixed inside the skill; motion and sound vary per video.
- **`video-promo`**: promotion of a product, site, or feature. The brand is extracted from the promoted product for each video and written to `brand.json` in the video folder.

## Installation

```bash
npx skills@latest add elmerjacobo97/video-skills
```

Or from this repo, inside the target folder:

```bash
./scripts/install-to-agent.sh claude
```

## Skill structure

```
skills/video/<skill>/
  SKILL.md       workflow and rules
  scripts/       generator
  assets/        fonts, sounds, example (video-tiktok also keeps its fixed brand here)
  references/    video.json format, brand
```

Generated videos are saved outside this repo, in `/Volumes/T7SHIELD/Projects/videos/`.

## Requirements

Node.js 22+, FFmpeg, and `npx hyperframes`.
