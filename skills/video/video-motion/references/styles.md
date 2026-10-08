# Styles

Pick one per video. Each style lists real building blocks from `hyperframes-animation` (rules in `rules/`, blueprints in `blueprints/`, transitions in `transitions/catalog.md`). Read only the ones you use. Names below exist in that skill; if one is missing in the installed version, check `rules-index.md` / `blueprints-index.md`.

| Style | Fits | Building blocks |
| --- | --- | --- |
| **Kinetic type** | Opinions, tips, comparisons of ideas, hooks with a strong sentence | rules `kinetic-beat-slam`, `gradient-text-sweep`, `counting-dynamic-scale`; blueprint `kinetic-type-beats`, `titlecard-reveal` |
| **Device showcase** | Product or feature promos, app screens | blueprints `device-surface-showcase`, `zoom-out-workspace-reveal`, `camera-journey`; rules `3d-page-scroll`, `3d-camera-flight`, `depth-of-field-blur` |
| **Terminal demo** | Commands, CLI tools, installs | blueprints `prompt-type-submit-generate`, `typewriter-reveal`, `cursor-ui-demo`; rules `discrete-text-sequence`, `context-sensitive-cursor` |
| **Data and proof** | Numbers, benchmarks, results (real figures only) | blueprint `dataviz-countup`; rules `counting-dynamic-scale`, `stat-bars-and-fills`, `chart-scrub-readout` |
| **Versus** | A vs B, before/after | blueprint `comparison-split`; example `examples/comparison-split-cards.html` |
| **Tech glitch** | Dev tools, AI news, edgy tone | rules `chromatic-glitch`, `hacker-flip-3d`; blueprint `ticker-takeover` |
| **Stations** | Lists of 3–5 things, tours | blueprints `spatial-pan-stations`, `grid-card-assemble`, `fixed-anchor-cycle` |

## Closers (CTA)

Pick a different closer from the previous video: blueprints `cta-morph-press`, `logo-assemble-lockup`, `constellation-hub`; example `examples/cta-orbit-collapse.html`. Promos end on the real URL or handle.

## Transitions

Vary them. Options: hard cut on a beat, mask wipe, scale push-through, camera whip, blur dissolve, shared-element handoff (see `hyperframes-keyframes`). Use CSS-driven transitions from `transitions/catalog.md` between sub-compositions. A plain crossfade is allowed only when the scene plan has none other nearby.

## Combining

A video uses one main style and may borrow one block from another. Example: Terminal demo with a Data counter as the payoff.
