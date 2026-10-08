#!/usr/bin/env node
// Generates a 1080x1920 promo video project (HyperFrames) from <project>/video.json and <project>/brand.json.
// The brand belongs to the promoted product, not to the skill: it is read from the project folder.
// Usage: node <skill>/scripts/generate.mjs <project-folder>
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const WIDTH = 1080;
const HEIGHT = 1920;
// TikTok safe zones: 12 % top, 25 % bottom, 8 % sides.
const X = 88;
const W = WIDTH - X * 2;
const FADE = 0.5;
const GSAP = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js";
const DURATION = { cover: 3.5, feature: 5, closing: 5 };

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const dir = process.argv[2] ? resolve(process.argv[2]) : fail("usage: node <skill>/scripts/generate.mjs <project-folder>");
const readJson = (name) => {
  const path = join(dir, name);
  if (!existsSync(path)) fail(`${path} does not exist`);
  return JSON.parse(readFileSync(path, "utf8"));
};
const spec = readJson("video.json");
const brand = readJson("brand.json");

for (const key of ["name", "colors", "font"]) if (!brand[key]) fail(`brand.json needs "${key}"`);
for (const key of ["background", "text", "accent", "onAccent"]) {
  if (!/^#[0-9a-f]{6}$/i.test(brand.colors[key] ?? "")) fail(`brand.json colors.${key} must be a #rrggbb color`);
}
const C = brand.colors;
const fontFiles = brand.font.files ?? {};
if (!brand.font.family || Object.keys(fontFiles).length === 0) fail('brand.json font needs "family" and "files" ({ "700": "assets/fonts/X.woff2" })');
for (const path of [...Object.values(fontFiles), brand.logo, brand.icon].filter(Boolean)) {
  if (!existsSync(join(dir, path))) fail(`brand.json: ${path} does not exist (path relative to the project)`);
}
if (!Array.isArray(spec.frames) || spec.frames.length === 0) fail('video.json needs a "frames" array');

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

const head = (f, p) =>
  `<div class="${p}-title" id="${p}-title">${rich(f.title)}</div>
      ${f.text ? `<div class="${p}-body" id="${p}-body">${rich(f.text)}</div>` : ""}`;
const headJs = (f, p) => enter(`#${p}-title`, 0.2) + (f.text ? enter(`#${p}-body`, 0.6) : "");

// Screenshots in 3D: the first image is in front, the others sit behind and to the left. The camera turns slowly all frame long.
function scene(images, p, duration) {
  const n = images.length;
  const cards = images.map((src, i) => {
    const front = i === 0;
    const pos = n === 1 ? "left: 142px; top: 0;" : front ? "left: 370px; top: 110px;" : `left: ${(i - 1) * 40}px; top: 0;`;
    const z = n === 1 ? 0 : front ? 60 : -160 * i;
    return `<img class="${p}-shot" src="${esc(src)}" alt="" style="${pos} width: ${n === 1 ? 620 : 520}px; transform: translateZ(${z}px);" />`;
  });
  return {
    html: `<div class="${p}-scene"><div class="${p}-group" id="${p}-group">${cards.reverse().join("\n        ")}</div></div>`,
    css: `
    .${p}-scene { position: relative; margin-top: 48px; height: 700px; perspective: 1600px; }
    .${p}-group { position: absolute; inset: 0; transform-style: preserve-3d; }
    .${p}-shot { position: absolute; max-height: 640px; height: auto; object-fit: cover; object-position: top left; border-radius: 28px; box-shadow: 0 40px 90px rgba(0, 0, 20, 0.55); }`,
    js: `
      tl.fromTo("#${p}-group", { rotationY: -28, rotationX: 10 }, { rotationY: 14, rotationX: 2, duration: ${duration}, ease: "sine.inOut" }, 0);
      tl.fromTo(".${p}-shot", { opacity: 0, z: -400 }, { opacity: 1, z: 0, duration: 0.9, ease: "power3.out", stagger: 0.2 }, 0.4);`,
  };
}

// Each type returns { css, html, js, duration }.
const TYPES = {
  cover(f, p) {
    const duration = f.duration ?? DURATION.cover;
    const s = f.images?.length ? scene(f.images, p, duration) : { html: "", css: "", js: "" };
    return {
      css: `.${p}-title { font-size: 104px; }${s.css}`,
      html: `${head(f, p)}\n      ${s.html}`,
      // The title does not animate: the first frame is the thumbnail and the hook must read from second 0.
      js: (f.text ? enter(`#${p}-body`, 0.4) : "") + s.js,
      duration,
    };
  },

  feature(f, p) {
    const duration = f.duration ?? DURATION.feature;
    const s = scene(f.images ?? fail(`feature "${f.title}" needs "images" (1 or 2 paths)`), p, duration);
    return { css: s.css, html: `${head(f, p)}\n      ${s.html}`, js: headJs(f, p) + s.js, duration };
  },

  closing(f, p) {
    const duration = f.duration ?? DURATION.closing;
    return {
      css: `
    .${p}-icon { width: 280px; height: 280px; margin-bottom: 56px; border-radius: 60px; object-fit: cover; box-shadow: 0 40px 90px rgba(0, 0, 20, 0.55); }
    .${p}-cta { margin-top: 48px; align-self: flex-start; padding: 28px 52px; border-radius: 999px; background: var(--accent);
      font-weight: 700; font-size: 56px; color: ${C.onAccent}; }`,
      html: `${brand.icon ? `<img class="${p}-icon" id="${p}-icon" src="${esc(brand.icon)}" alt="" />` : ""}
      ${head(f, p)}
      <div class="${p}-cta" id="${p}-cta">${esc(f.cta ?? brand.cta ?? brand.name)}</div>`,
      js: (brand.icon ? enter(`#${p}-icon`, 0.1) : "") + headJs(f, p) +
        `
      tl.fromTo("#${p}-cta", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 1.1);`,
      duration,
    };
  },
};

function composition({ id, p, dur, part }) {
  const fonts = Object.entries(brand.font.files)
    .map(([weight, path]) => `@font-face { font-family: "${brand.font.family}"; font-weight: ${weight}; src: url("${path}") format("woff2"); }`)
    .join("\n    ");
  const top = C.backgroundTop ?? C.background;
  return `<template>
  <style>
    ${fonts}
    [data-composition-id="${id}"] {
      --bg: ${C.background}; --fg: ${C.text}; --accent: ${C.accent}; --muted: ${rgba(C.text, 0.78)};
      font-family: "${brand.font.family}", "Helvetica Neue", Arial, sans-serif; }
    #root { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; color: var(--fg); }
    .${p}-bg { position: absolute; inset: 0; background: linear-gradient(180deg, ${top} 0%, var(--bg) 70%); }
    .${p}-glow { position: absolute; left: 240px; top: -420px; width: 1300px; height: 1300px; border-radius: 50%;
      background: radial-gradient(circle, ${C.glow ?? C.accent} 0%, ${rgba(C.glow ?? C.accent, 0)} 65%); opacity: ${C.glow ? 1 : 0.35}; }
    .${p}-logo { position: absolute; left: ${X}px; top: 250px; width: 250px; height: auto; }
    .${p}-name { position: absolute; left: ${X}px; top: 260px; font-weight: 700; font-size: 52px; }
    .${p}-stage { position: absolute; left: ${X}px; top: 370px; width: ${W}px; height: 1070px; display: flex; flex-direction: column; }
    .${p}-title { font-weight: 700; font-size: 92px; line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
    .${p}-body { margin-top: 28px; font-size: 46px; line-height: 1.3; color: var(--muted); text-wrap: balance; }
    .${p}-stage .hl { color: var(--accent); font-weight: inherit; }
    ${part.css}
  </style>

  <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="${WIDTH}" data-height="${HEIGHT}">
    <div class="clip ${p}-bg" id="${p}-bg" data-start="0" data-duration="${dur}" data-track-index="0"></div>
    <div class="clip ${p}-glow" id="${p}-glow" data-start="0" data-duration="${dur}" data-track-index="1"></div>
    ${brand.logo ? `<img class="${p}-logo" src="${esc(brand.logo)}" alt="${esc(brand.name)}" />` : `<div class="${p}-name">${esc(brand.name)}</div>`}
    <div class="${p}-stage" id="${p}-stage">
      ${part.html}
    </div>
  </div>

  <script src="${GSAP}"></script>
  <script>
    (function () {
      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });
      tl.fromTo("#${p}-glow", { x: -80, y: 0 }, { x: 80, y: 120, duration: ${part.duration}, ease: "sine.inOut" }, 0);${part.js}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

function indexHtml(scenes, total) {
  const clips = scenes
    .map(
      (s, i) => `      <div id="el-${s.id}" class="scene" data-composition-id="${s.id}" data-composition-src="compositions/frames/${s.id}.html"
        data-start="${s.start}" data-duration="${s.dur}" data-track-index="${i % 2}"></div>`,
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

mkdirSync(join(dir, "compositions", "frames"), { recursive: true });
const scenes = [];
let start = 0;
spec.frames.forEach((f, i) => {
  const type = TYPES[f.type] ?? fail(`frame ${i + 1}: unknown type "${f.type}" (options: ${Object.keys(TYPES).join(", ")})`);
  for (const image of [...(f.images ?? [])]) {
    if (!existsSync(join(dir, image))) fail(`frame ${i + 1}: image ${image} does not exist (path relative to the project)`);
  }
  const p = `f${i + 1}`;
  const id = `${String(i + 1).padStart(2, "0")}-${f.type}`;
  const part = type(f, p);
  const dur = round(part.duration + (i === spec.frames.length - 1 ? 0 : FADE));
  writeFileSync(join(dir, "compositions", "frames", `${id}.html`), composition({ id, p, dur, part }));
  scenes.push({ id, start, dur });
  start = round(start + part.duration);
});

writeFileSync(join(dir, "index.html"), indexHtml(scenes, start));
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

console.log(`✓ ${scenes.length} frames, ${start}s → ${dir}`);
