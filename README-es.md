[English](README.md) · [Español](README-es.md)

# Video Skills

Skills para generar videos con HyperFrames (HTML + GSAP renderizado a MP4). Cada skill lleva dentro su generador, su marca y sus referencias: no dependen de ninguna carpeta del usuario.

## Skills

| Skill | Uso |
| --- | --- |
| [`video-tiktok`](./skills/video/video-tiktok/SKILL.md) | Videos verticales 1080x1920 para TikTok con la marca elmerjacobo.dev: tutoriales, listas y anuncios |
| [`video-motion`](./skills/video/video-motion/SKILL.md) | Método compartido: escenas armadas una a una con movimiento, transiciones, cámara y sonido variados; lo usan las otras dos |
| [`video-promo`](./skills/video/video-promo/SKILL.md) | Videos promocionales verticales de un producto, sitio o feature con la marca del propio producto (colores, fuente, logo) |

## Cuál usar

- **`video-tiktok`**: contenido con tu propia marca (tutoriales, listas, comparativas). La marca es fija y vive dentro de la skill; el movimiento y el sonido cambian en cada video.
- **`video-promo`**: promoción de un producto, sitio o feature. La marca se extrae del producto promocionado en cada video y se guarda en `brand.json` dentro de la carpeta del video.

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
  assets/        fuentes, sonidos, ejemplo (video-tiktok también guarda aquí su marca fija)
  references/    formato de video.json, marca
```

Los videos generados se guardan fuera de este repo, en `/Volumes/T7SHIELD/Projects/videos/`.

## Requisitos

Node.js 22+, FFmpeg y `npx hyperframes`.
