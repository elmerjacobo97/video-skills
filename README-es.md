[English](README.md) · [Español](README-es.md)

# Video Skills

Skills para generar videos con HyperFrames (HTML + GSAP renderizado a MP4). Cada skill lleva dentro su generador, su marca y sus referencias: no dependen de ninguna carpeta del usuario.

## Skills

| Skill | Uso |
| --- | --- |
| [`video-tiktok`](./skills/video/video-tiktok/SKILL.md) | Videos verticales 1080x1920 para TikTok con la marca elmerjacobo.dev: tutoriales, listas y anuncios |
| [`video-promo`](./skills/video/video-promo/SKILL.md) | Videos promocionales verticales de un producto, sitio o feature con la marca del propio producto (colores, fuente, logo) |

## Instalación

```bash
npx skills@latest add elmerjacobo97/video-skills
```

O desde este repo, en la carpeta destino:

```bash
./scripts/install-to-agent.sh claude
```

## Estructura de una skill

```
skills/video/<skill>/
  SKILL.md       flujo y reglas
  scripts/       generador
  assets/        marca, fuentes, sonidos, ejemplo
  references/    formato de video.json, marca
```

Los videos generados se guardan fuera de este repo, en `/Volumes/T7SHIELD/Projects/videos/`.

## Requisitos

Node.js 22+, FFmpeg y `npx hyperframes`.
