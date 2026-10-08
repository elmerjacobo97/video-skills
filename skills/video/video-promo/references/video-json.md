# `video.json` format (promo)

Keys and types are in English. Values shown on screen are written in the video's language, Spanish by default. Example: `assets/example.json`.

```json
{
  "frames": [
    { "type": "cover", "title": "Tu tarjeta de papel *no guarda tus leads*", "text": "Cada lead no registrado es una venta perdida." },
    { "type": "feature", "title": "Captura de leads *automática*", "text": "…", "images": ["assets/img/leads.jpg"] },
    { "type": "closing", "title": "Tu tarjeta digital que *guarda tus leads*", "text": "Crea la tuya hoy.", "cta": "tarjetly.com" }
  ]
}
```

## Emphasis

`*word*` renders in the brand's accent color, in `title` and `text`. One or two words per frame.

## Frame types

| Type | Fields | Use |
| --- | --- | --- |
| `cover` | `title`, `text?`, `images?`, `duration?` | First frame: the hook. The title is visible from second 0 (it is the thumbnail). Add `images` to show a 3D screenshot. |
| `feature` | `title`, `text?`, `images` (1 or 2 paths), `duration?` | One feature. One image: centered. Two: the first in front, the second behind. The camera turns slowly. |
| `closing` | `title`, `text?`, `cta?`, `duration?` | Last frame: brand icon, promise, and the button (`cta`, defaults to `brand.json` `cta`). |

## Rules

- `images` are paths relative to the video folder (`assets/img/x.jpg`). Product screenshots work best; avoid images with tiny text.
- Default durations: `cover` 3.5 s, `feature` 5 s, `closing` 5 s. `duration` overrides them.
- 4 to 6 frames, 15–25 s total.
