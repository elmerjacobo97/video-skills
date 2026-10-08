#!/usr/bin/env node
// Generates a 1080x1920 HyperFrames project with the brand in assets/brand.json from <project>/video.json.
// Usage: node <skill>/scripts/generate.mjs <project-folder>
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The brand and assets travel with the skill: scripts/ and assets/ are siblings.
const ASSETS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const brand = JSON.parse(readFileSync(join(ASSETS_DIR, "brand.json"), "utf8"));
const C = brand.colors;

const WIDTH = 1080;
const HEIGHT = 1920;
// TikTok safe zones: 12 % top, 25 % bottom, 8 % sides.
const X = 88;
const W = WIDTH - X * 2;
const FADE = 0.5;
// Characters that fit on one terminal line at 40 px, counting the prompt and the indentation.
const MAX_COMMAND_LINE = 34;
const GSAP = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js";
const DURATION = { cover: 3, list: 5, text: 6, screenshots: 6, closing: 5 };
const SFX = {
  typing: { file: "keyboard-typing.mp3", dur: 3, vol: 0.8 },
  chime: { file: "success-chime.mp3", dur: 2.2, vol: 0.9 },
};
const ICONS = {
  layers:
    '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const esc = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Text with emphasis: *word* renders in the accent color.
const rich = (text) => esc(text).replace(/\*(.+?)\*/g, '<b class="hl">$1</b>');

const round = (n) => Math.round(n * 100) / 100;

function enter(selector, at, y = 40) {
  return `
      tl.fromTo(${JSON.stringify(selector)}, { opacity: 0, y: ${y} }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, ${round(at)});`;
}

// Each type returns { css, html, js, duration, sfx: [{ name, at, dur? }] }.
// Sound only where it accompanies an action: typing while a command is written and a chime when there is output.
const TYPES = {
  cover(f, p) {
    return {
      css: `.${p}-title { font-size: 112px; }`,
      html: `<div class="${p}-title" id="${p}-title">${esc(f.title)}</div>
      ${f.subtitle ? `<div class="${p}-body" id="${p}-body">${rich(f.subtitle)}</div>` : ""}`,
      // The title does not animate: the first frame is the thumbnail and the hook must read from second 0.
      js: f.subtitle ? enter(`#${p}-body`, 0.4) : "",
      duration: DURATION.cover,
      sfx: [],
    };
  },

  text(f, p) {
    return {
      css: `
    .${p}-photo { width: 320px; height: 320px; margin-bottom: 56px; object-fit: cover; object-position: top; border-radius: 8px; filter: grayscale(1); }`,
      html: `${f.image ? `<img class="${p}-photo" id="${p}-photo" src="${esc(f.image)}" alt="" />` : ""}
      <div class="${p}-title" id="${p}-title">${esc(titleOf(f))}</div>
      <div class="${p}-body" id="${p}-body">${rich(f.text)}</div>`,
      js: (f.image ? enter(`#${p}-photo`, 0.1) : "") + enter(`#${p}-title`, 0.2) + enter(`#${p}-body`, 0.7),
      duration: DURATION.text,
      sfx: [],
    };
  },

  // Screenshots stacked in perspective: the first image is in front. The camera turns slowly during the whole frame.
  screenshots(f, p) {
    const n = f.images.length;
    const width = W - (n - 1) * 120;
    const height = Math.round(width * 0.625);
    const cards = f.images.map(
      (src, i) => `<img class="${p}-shot" id="${p}-shot${i}" src="${esc(src)}" alt=""
          style="left: ${i * 120}px; top: ${(n - 1 - i) * 130}px; transform: translateZ(${-i * 140}px); z-index: ${n - i};" />`,
    );
    const duration = DURATION.screenshots;
    return {
      css: `
    .${p}-scene { position: relative; margin-top: 56px; height: ${height + (n - 1) * 130}px; perspective: 1600px; }
    .${p}-group { position: absolute; inset: 0; transform-style: preserve-3d; transform-origin: 40% 50%; }
    .${p}-shot { position: absolute; width: ${width}px; height: ${height}px; object-fit: cover; object-position: top left;
      border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); }`,
      html: `<div class="${p}-title" id="${p}-title">${esc(titleOf(f))}</div>
      ${f.text ? `<div class="${p}-body" id="${p}-body">${rich(f.text)}</div>` : ""}
      <div class="${p}-scene" id="${p}-scene"><div class="${p}-group" id="${p}-group">
        ${cards.reverse().join("\n        ")}
      </div></div>`,
      js:
        enter(`#${p}-title`, 0.2) +
        (f.text ? enter(`#${p}-body`, 0.5) : "") +
        `
      tl.fromTo("#${p}-group", { rotationY: -20, rotationX: 8 }, { rotationY: -6, rotationX: 3, duration: ${duration}, ease: "sine.out" }, 0);
      tl.fromTo(".${p}-shot", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: -0.25 }, 0.6);`,
      duration,
      sfx: [],
    };
  },

  list(f, p) {
    const rows = f.items.map(
      (item, i) => `<div class="${p}-row${item.highlighted ? " on" : ""}" id="${p}-row${i}">
        <div class="${p}-name">${esc(item.name)}</div>${item.note ? `<div class="${p}-note">${rich(item.note)}</div>` : ""}
      </div>`,
    );
    return {
      css: `
    .${p}-row { margin-top: 32px; padding-top: 28px; border-top: 1px solid var(--line); }
    .${p}-name { font-weight: 700; font-size: 68px; line-height: 1.1; letter-spacing: -0.02em; color: var(--fg); }
    .${p}-note { margin-top: 8px; font-size: 40px; line-height: 1.25; color: var(--muted); }
    .${p}-row.on .${p}-name, .${p}-row.on .${p}-note { color: var(--accent); }`,
      html: `<div class="${p}-title" id="${p}-title">${esc(titleOf(f))}</div>
      ${rows.join("\n      ")}`,
      js: enter(`#${p}-title`, 0.2) + f.items.map((_, i) => enter(`#${p}-row${i}`, 0.8 + i * 0.5)).join(""),
      duration: Math.max(DURATION.list, 2.8 + f.items.length * 0.7),
      sfx: [],
    };
  },

  step(f, p) {
    const lines = [f.command].flat();
    const command = lines.join(" \\\n  ");
    const tooLong = `$ ${command}`.split("\n").filter((line) => line.length > MAX_COMMAND_LINE);
    if (tooLong.length) {
      fail(`command too wide (max ${MAX_COMMAND_LINE} characters per line), split it into an array: "${tooLong[0]}"`);
    }
    const from = f.highlight ? command.indexOf(f.highlight) : command.length;
    if (from < 0) fail(`"highlight" does not appear in the command: ${f.highlight}`);
    const to = f.highlight ? from + f.highlight.length : command.length;
    const start = 1.6;
    const typing = Math.min(3, Math.max(1.2, command.length * 0.06));
    const done = start + typing + 0.3;
    return {
      css: `
    .${p}-term { margin-top: 48px; padding: 40px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
      font-family: var(--font-mono); font-size: 40px; line-height: 1.5; color: var(--fg); }
    .${p}-term span { white-space: pre; }
    .${p}-cmd { min-height: ${command.split("\n").length * 60}px; }
    .${p}-prompt, .${p}-hi { color: var(--accent); }
    .${p}-cursor { display: inline-block; width: 22px; height: 46px; margin-left: 6px; background: var(--accent); vertical-align: text-bottom; }
    .${p}-ok { margin-top: 28px; font-size: 30px; line-height: 1.45; color: var(--muted); }
    .${p}-ok b { color: var(--accent); font-weight: 400; }`,
      html: `<div class="${p}-title" id="${p}-title">${esc(titleOf(f))}</div>
      <div class="${p}-term" id="${p}-term">
        <div class="${p}-cmd"><span class="${p}-prompt">${esc(f.prompt ?? "$")} </span><span id="${p}-pre"></span><span class="${p}-hi" id="${p}-hi"></span><span id="${p}-post"></span><i class="${p}-cursor" id="${p}-cursor"></i></div>
        ${f.output ? `<div class="${p}-ok" id="${p}-ok"><b>✓</b> ${esc(f.output)}</div>` : ""}
      </div>`,
      js: `
      var CMD = ${JSON.stringify(command)}, A = ${from}, B = ${to}, typed = { n: 0 };
      var pre = document.getElementById("${p}-pre"), hi = document.getElementById("${p}-hi"), post = document.getElementById("${p}-post");${enter(`#${p}-title`, 0.2)}${enter(`#${p}-term`, 0.9, 60)}
      tl.to(typed, { n: CMD.length, duration: ${round(typing)}, ease: "none", onUpdate: function () {
        var n = Math.round(typed.n);
        pre.textContent = CMD.slice(0, Math.min(n, A));
        hi.textContent = CMD.slice(A, Math.min(Math.max(n, A), B));
        post.textContent = CMD.slice(B, Math.max(n, B));
      } }, ${start});
      tl.to("#${p}-cursor", { opacity: 0, duration: 0.2 }, ${round(done - 0.1)});${f.output ? enter(`#${p}-ok`, done, 14) : ""}`,
      duration: round(Math.ceil(done + 1.6)),
      sfx: [
        { name: "typing", at: start, dur: round(typing) },
        ...(f.output ? [{ name: "chime", at: round(done) }] : []),
      ],
    };
  },

  closing(f, p) {
    return {
      css: `
    .${p}-title { font-size: 120px; }
    .${p}-ask { margin-top: 40px; font-size: 60px; line-height: 1.25; color: var(--fg); }
    .${p}-follow { margin-top: 40px; font-weight: 500; font-size: 44px; color: var(--accent); }
    .${p}-sign { margin-top: 20px; font-size: 56px; color: ${rgba(C.text, 0.6)}; }`,
      html: `<div class="${p}-title" id="${p}-title">${esc(f.title ?? brand.closing.save)}</div>
      ${f.question ? `<div class="${p}-ask" id="${p}-ask">${rich(f.question)}</div>` : ""}
      <div class="${p}-follow" id="${p}-follow">${esc(f.follow ?? brand.closing.follow)}</div>
      <div class="${p}-sign" id="${p}-sign">${esc(brand.signature)}</div>`,
      js:
        enter(`#${p}-title`, 0.2, 60) +
        (f.question ? enter(`#${p}-ask`, 0.8) : "") +
        enter(`#${p}-follow`, 1.3) +
        enter(`#${p}-sign`, 1.6),
      duration: DURATION.closing,
      sfx: [],
    };
  },
};

function titleOf(f) {
  return f.number ? `${f.number}. ${f.title}` : f.title;
}

function composition({ id, p, index, total, dur, part, icon }) {
  const segments = Array.from({ length: total }, (_, i) =>
    i < index ? '<i class="on"></i>' : i === index ? `<i><b id="${p}-fill"></b></i>` : "<i></i>",
  ).join("");
  return `<template>
  <style>
    @font-face { font-family: "${brand.fonts.display}"; font-weight: 300 700; src: url("assets/fonts/SpaceGrotesk.woff2") format("woff2"); }
    [data-composition-id="${id}"] {
      --bg: ${C.background}; --fg: ${C.text}; --accent: ${C.accent}; --surface: ${C.surface}; --line: ${C.line}; --muted: ${C.muted};
      --dot: ${rgba(C.text, 0.15)}; --brand: ${rgba(C.text, 0.6)};
      --font-display: "${brand.fonts.display}", "Helvetica Neue", Arial, sans-serif; --font-mono: "${brand.fonts.mono}", ui-monospace, monospace;
      font-family: var(--font-display); }
    #root { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
    .${p}-bg { position: absolute; inset: 0; background-color: var(--bg);
      background-image: radial-gradient(circle, var(--dot) 2px, transparent 2.5px); background-size: 40px 40px; }
    .${p}-prog { position: absolute; left: ${X}px; width: ${W}px; top: 230px; display: flex; gap: 8px; }
    .${p}-prog i { flex: 1; height: 6px; background: var(--line); position: relative; }
    .${p}-prog i.on { background: var(--accent); }
    .${p}-prog i b { position: absolute; inset: 0; background: var(--accent); transform-origin: left center; }
    .${p}-brand { position: absolute; left: ${X}px; top: 276px; font-size: 36px; line-height: 1; color: var(--brand); }
    .${p}-icon { position: absolute; right: ${X}px; top: 264px; width: 60px; height: 60px; color: var(--accent); }
    .${p}-stage { position: absolute; left: ${X}px; top: 380px; width: ${W}px; height: 1020px; display: flex; flex-direction: column; justify-content: center; }
    .${p}-title { font-weight: 700; font-size: 104px; line-height: 1.06; letter-spacing: -0.02em; color: var(--accent); text-wrap: balance; }
    .${p}-body { margin-top: 40px; font-size: 56px; line-height: 1.3; color: var(--fg); text-wrap: balance; }
    .${p}-stage .hl { color: var(--accent); font-weight: inherit; }
    ${part.css}
  </style>

  <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="${WIDTH}" data-height="${HEIGHT}">
    <div class="clip ${p}-bg" id="${p}-bg" data-start="0" data-duration="${dur}" data-track-index="0"></div>
    <div class="${p}-prog" id="${p}-prog">${segments}</div>
    <div class="${p}-brand" id="${p}-brand">${esc(brand.site)}</div>
    <svg class="${p}-icon" id="${p}-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
    <div class="${p}-stage" id="${p}-stage">
      ${part.html}
    </div>
  </div>

  <script src="${GSAP}"></script>
  <script>
    (function () {
      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });
      tl.fromTo("#${p}-fill", { scaleX: 0 }, { scaleX: 1, duration: ${part.duration}, ease: "none" }, 0);${part.js}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

function indexHtml(scenes, audios, total) {
  const clips = scenes
    .map(
      (s, i) => `      <div id="el-${s.id}" class="scene" data-composition-id="${s.id}" data-composition-src="compositions/frames/${s.id}.html"
        data-start="${s.start}" data-duration="${s.dur}" data-track-index="${i % 2}"></div>`,
    )
    .join("\n");
  const tracks = audios
    .map(
      (a, i) => `      <audio id="el-sfx-${i}" src="assets/sfx/${a.file}" data-start="${a.at}" data-duration="${a.dur}"
        data-track-index="${20 + i}" data-volume="${a.vol}"></audio>`,
    )
    .join("\n");
  const fades = scenes
    .slice(1)
    .map(
      (s, i) => `
        tl.to("#el-${scenes[i].id}", { opacity: 0, duration: ${FADE}, ease: "power2.inOut" }, ${s.start});
        tl.fromTo("#el-${s.id}", { opacity: 0 }, { opacity: 1, duration: ${FADE}, ease: "power2.inOut" }, ${s.start});`,
    )
    .join("");
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${WIDTH}, height=${HEIGHT}" />
    <script src="${GSAP}"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${C.background}; }
      #root { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${C.background}; }
      .scene { position: absolute; inset: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${WIDTH}" data-height="${HEIGHT}">
${clips}
${tracks}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
      (function () {
        var tl = window.__timelines["main"];${fades}
        tl.to({}, { duration: ${total} }, 0);
      })();
    </script>
  </body>
</html>
`;
}

function writeIfMissing(path, content) {
  if (!existsSync(path)) writeFileSync(path, content);
}

const dir = process.argv[2] ? resolve(process.argv[2]) : fail("usage: node <skill>/scripts/generate.mjs <project-folder>");
const specPath = join(dir, "video.json");
if (!existsSync(specPath)) fail(`${specPath} does not exist`);
const spec = JSON.parse(readFileSync(specPath, "utf8"));
if (!Array.isArray(spec.frames) || spec.frames.length === 0) fail('video.json needs a "frames" array');
const icon = ICONS[spec.icon ?? "layers"] ?? fail(`unknown icon "${spec.icon}" (options: ${Object.keys(ICONS).join(", ")})`);

mkdirSync(join(dir, "compositions", "frames"), { recursive: true });
cpSync(join(ASSETS_DIR, "fonts"), join(dir, "assets", "fonts"), { recursive: true });
cpSync(join(ASSETS_DIR, "sfx"), join(dir, "assets", "sfx"), { recursive: true });

const scenes = [];
const audios = [];
let start = 0;
spec.frames.forEach((f, i) => {
  const type = TYPES[f.type] ?? fail(`frame ${i + 1}: unknown type "${f.type}" (options: ${Object.keys(TYPES).join(", ")})`);
  const p = `f${i + 1}`;
  const id = `${String(i + 1).padStart(2, "0")}-${f.type}`;
  for (const image of [f.image, ...(f.images ?? [])].filter(Boolean)) {
    if (!existsSync(join(dir, image))) fail(`frame ${i + 1}: image ${image} does not exist (path relative to the project)`);
  }
  const part = type(f, p);
  if (f.duration) part.duration = f.duration;
  const last = i === spec.frames.length - 1;
  const dur = round(part.duration + (last ? 0 : FADE));
  writeFileSync(
    join(dir, "compositions", "frames", `${id}.html`),
    composition({ id, p, index: i, total: spec.frames.length, dur, part, icon }),
  );
  scenes.push({ id, start, dur });
  for (const s of part.sfx) {
    const base = SFX[s.name];
    audios.push({ file: base.file, at: round(start + s.at), dur: s.dur ?? base.dur, vol: base.vol });
  }
  start = round(start + part.duration);
});

writeFileSync(join(dir, "index.html"), indexHtml(scenes, spec.sfx === false ? [] : audios, start));
const name = basename(dir);
writeIfMissing(
  join(dir, "hyperframes.json"),
  JSON.stringify(
    {
      $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
      registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
    },
    null,
    2,
  ) + "\n",
);
writeIfMissing(join(dir, "meta.json"), JSON.stringify({ id: name, name }, null, 2) + "\n");
writeIfMissing(join(dir, "package.json"), JSON.stringify({ name, private: true, type: "module" }, null, 2) + "\n");

console.log(`✓ ${scenes.length} frames, ${start}s, ${spec.sfx === false ? 0 : audios.length} effects → ${dir}`);
