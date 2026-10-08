# `video.json` format

Keys, types, and error messages are in English. The values shown on screen (titles, text, questions) are written in the video's language, Spanish by default.

```json
{
  "icon": "terminal",
  "frames": [
    { "type": "cover", "title": "…", "subtitle": "…" },
    { "type": "list", "title": "…", "items": [{ "name": "…", "note": "…", "highlighted": true }] },
    { "type": "step", "number": 1, "title": "…", "command": ["line 1", "line 2"], "highlight": "…", "output": "…" },
    { "type": "text", "number": 2, "title": "…", "text": "…" },
    { "type": "closing", "question": "…" }
  ]
}
```

Full example: `assets/example.json`.

## Root

- `icon`: `layers` (default), `terminal`, `code`, `bolt`, `play`.
- `sfx: false`: video without sound effects.
- `duration` (seconds) on any frame replaces the automatic duration.

## Emphasis

`*word*` renders in the accent color. Works in `subtitle`, `text`, `note`, and `question`. One or two keywords per frame, no more.

## Images

Copy them to `<folder>/assets/img/` and reference them with a project-relative path (`assets/img/x.png`).

## Frame types

| Type | Fields | Use |
| --- | --- | --- |
| `cover` | `title`, `subtitle?` | First frame. Title with the keyword, short subtitle. |
| `list` | `title`, `items[]` (`name`, `note?`, `highlighted?`), `number?` | Requirements, options. Max 4 items. |
| `step` | `title`, `command`, `number?`, `highlight?`, `output?`, `prompt?` | A command typed in a terminal. |
| `text` | `title`, `text`, `number?`, `image?` | One idea per frame, max 25 words. `image` shows a grayscale square photo above the title. |
| `screenshots` | `title`, `images[]` (1 to 3 paths), `text?` | Screenshots stacked in perspective with a slow camera turn. The first one is in front. |
| `closing` | `question?`, `title?`, `follow?` | Last frame. "Guárdalo para después", "Sígueme para más", and the signature come from `brand.json`. In an ad, `title` and `follow` carry the call to action. |

## Rules

- `command`: max 34 characters per line counting the leading `$ ` and the indentation. If longer, pass it as an array; the generator joins lines with `\`.
- `highlight` must be an exact fragment of the command.
- `output`: the command's real output, never an invented one.
