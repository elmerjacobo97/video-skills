# `brand.json`

Written per video, in the video folder, from the promoted product's real brand. Paths are relative to the video folder. See `assets/brand.example.json`.

```json
{
  "name": "Tarjetly",
  "logo": "assets/img/logo.svg",
  "icon": "assets/img/icon.png",
  "cta": "tarjetly.com",
  "colors": {
    "background": "#030081",
    "backgroundTop": "#1a12a8",
    "glow": "#b52fb0",
    "text": "#ffffff",
    "accent": "#32a7e0",
    "onAccent": "#030081"
  },
  "font": {
    "family": "Onest",
    "files": { "400": "assets/fonts/Onest-Regular.woff2", "700": "assets/fonts/Onest-Bold.woff2" }
  }
}
```

| Key | Required | Meaning |
| --- | --- | --- |
| `name` | yes | Product name; shown in the header when there is no `logo`. |
| `logo` | no | Header image (SVG/PNG, light version over a dark background). |
| `icon` | no | Square app icon shown on the `closing` frame. |
| `cta` | no | Default text of the closing button. |
| `colors.background` | yes | Main background (bottom of the gradient). |
| `colors.backgroundTop` | no | Top of the gradient; defaults to `background`. |
| `colors.glow` | no | Soft moving light behind the scene; defaults to a faint `accent`. |
| `colors.text` | yes | Main text color. Must contrast with `background`. |
| `colors.accent` | yes | Emphasis words (`*word*`) and the CTA button. |
| `colors.onAccent` | yes | Text color on top of the `accent` button. |
| `font.family` / `font.files` | yes | Font name and `woff2` files by weight (`400`, `700`). |

## Where to get each value

- **Colors:** `capture/extracted/tokens.json` (site) or the repo's CSS variables / Tailwind theme. Prefer the hero's colors over the footer's. Check contrast of `text` on `background` and `onAccent` on `accent`.
- **Font:** `capture/assets/fonts/` when captured; otherwise download the `woff2` from Google Fonts. Copy to `<folder>/assets/fonts/`.
- **Logo and icon:** `capture/assets/` (`logo-*.svg`, `favicon.png`, `icon-*.png`). Open candidates to confirm they are the real brand logo; never compose a fake one. A logo with dark ink on a dark background is invisible: pick the light version.

Always show the finished `brand.json` to the user before generating.
