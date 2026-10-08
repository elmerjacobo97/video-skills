[English](README.md) · [Español](README-es.md)

# Video Skills

Skills for generating videos with HyperFrames (HTML + GSAP rendered to MP4). Each skill carries its own generator, brand, and references: none depends on a user folder.

## Skills

| Skill | Use |
| --- | --- |
| [`video-tiktok`](./skills/video/video-tiktok/SKILL.md) | Vertical 1080x1920 TikTok videos with the elmerjacobo.dev brand: tutorials, lists, and ads |

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
  assets/        brand, fonts, sounds, example
  references/    video.json format, brand
```

Generated videos are saved outside this repo, in `/Volumes/T7SHIELD/Projects/videos/`.

## Requirements

Node.js 22+, FFmpeg, and `npx hyperframes`.
