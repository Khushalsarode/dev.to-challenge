# 🍷🔥 Passion Uncorked — Complete Project Documentation (FINAL v2)
### DEV Weekend Challenge: Passion Edition · Dual Vessel · Settings · Gallery · Ambient Score Edition
### Supersedes `passion-uncorked-FINAL.md` — this reflects the actual, implemented, verified codebase, not a build plan

---

## CHANGELOG — What This Revision Adds Over FINAL v1

FINAL v1 was a build *plan*. Everything in this section was actually implemented, run, and tested end
to end (Playwright + direct API verification) after v1 shipped. Nothing below is speculative — every
claim in this document is backed by a file that exists in `passion-uncorked/src/` today.

| # | Area | v1 (plan) | v2 (built) |
|---|---|---|---|
| 1 | Model | `gemini-3.5-flash` (didn't exist / wrong assumption) | `gemini-2.5-flash`, confirmed live against the account's actual model list |
| 2 | Gemini SDK | `@google/genai@^0.7.0` | `^2.11.0` — the 0.7.0 line silently drops `thinkingConfig.thinkingBudget`, which breaks generation on thinking-capable models (§7.5) |
| 3 | ElevenLabs | raw `fetch`, no SDK ("no bloat") | official `@elevenlabs/elevenlabs-js` SDK, **lazy-loaded** via dynamic `import()` so the ~4.6MB package never touches the initial bundle (§8) |
| 4 | Tone | one voice (classy/elegant) per vessel | **Classy / Sassy** toggle — a second system-instruction set per vessel, user-selectable (§10.4) |
| 5 | Visuals | static SVG bottle/anvil only | refined SVG animations (foil capsule, bubbles, meniscus, gradient flames, glow bloom) **plus** an optional real AI-generated vessel photograph with the label's own text baked into the image (§11, §12) |
| 6 | Sound | none | an original synthesized ambient music score (two short looping compositions, Web Audio API, no audio files) (§13) |
| 7 | Settings | none | a full settings drawer: narration, volume, per-vessel voice picker, motion, tone, creativity, accent override, AI-artwork toggle, ambient sound + volume (§9) |
| 8 | Navigation | none — screens were full-bleed with no chrome | persistent top nav bar: brand/reset, ambient mute toggle, gallery, settings (§14) |
| 9 | History | none | a local (no server) gallery of past generations, revisiting one costs zero API calls (§14.3) |
| 10 | Reliability | "try/catch, fallback hardcoded label" | a **repair-then-retry** pipeline for Gemini's occasional truncated-JSON responses, empirically diagnosed and fixed (§7.6) |
| 11 | Color values | `vessels.js` referenced CSS custom properties (`var(--wine-bg)`) | plain hex — CSS-var strings can't be alpha-suffixed in JS (`` `${color}66` `` silently produces invalid CSS); this was a real, shipped bug fixed during this revision |

**Known, confirmed, non-code limitations carried forward as of this writing:**
- The Gemini API **free tier grants zero quota for every image-generation model** (`gemini-2.5-flash-image` and siblings) — confirmed via direct `429 RESOURCE_EXHAUSTED, limit 0` responses, not a rate limit that resets. AI artwork requires a paid Gemini/Google AI Studio project.
- ElevenLabs keys can carry a **per-key credit cap independent of the account's actual plan** (Profile → API Keys → key → usage limit). A key capped at 0 fails every request regardless of the account's real quota.

Both are gated off by default and fail gracefully (§7.6, §9) — the product never silently burns quota it can't use, and never crashes when either service is unavailable.

---

## 0. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Passion Uncorked |
| **Tagline** | *Every passion is either aged or forged. Type yours.* |
| **Challenge** | DEV Weekend Challenge: Passion Edition |
| **Prize Targets** | Overall Winner · Best Use of Google AI · Best Use of ElevenLabs |
| **Deploy Target** | Vercel (free tier) |
| **Post Title** | "I stopped building dashboards. I built a winery — and a forge." |

---

## 1. Theme Alignment (why this wins on Relevance)

The challenge prompt splits passion into two registers by its own language:
- *"the rivalry that pushes competitors to greatness"* → 🔥 Fire
- *"the love that fuels late-night side projects"* → 🍷 Wine

Most submissions pick one reading. This product doesn't pick a side — it hands the user the choice, in
the moment they type their passion in. The vessel choice **is** the theme argument. v2 adds a second
axis of demonstrated range: **Classy vs. Sassy** tone (§10.4) — the same duality (measured devotion vs.
sharp-edged intensity) now runs through *how* the AI writes, not just which vessel it writes into.

---

## 2. Product Summary

Passion Uncorked is a single-page web app. A user types anything they're passionate about, chooses a
vessel — **wine** (aged, devoted) or **fire** (forged, intense) — and receives a hand-crafted artifact:
a vintage wine label or a forge mark, generated in one Gemini call and narrated by a distinct
ElevenLabs voice per vessel.

Every artifact is visually unique — Gemini returns a `color_mood` field that drives the accent color
(or the user can override it manually), so no two passions render identically even within the same
vessel. The user downloads a high-res PNG or shares directly to X. An ambient, originally-composed
music score plays in the background, themed per vessel. Past generations are saved to a local gallery
for free revisiting. A settings panel gives full control over narration, tone, creativity, motion, and
(when the user has a paid Gemini key) real AI-generated artwork.

**The formula:** One input → One vessel choice → One AI call → One beautiful, unique, shareable,
narrated artifact — with the tone, voice, motion, and even the color entirely under the user's control.

---

## 3. Competitive Gap Analysis

| Submission | Tech | What it lacks |
|---|---|---|
| DuelUp Live | Gemini + ElevenLabs | Sports announcer register only, no personal artifact, no download |
| Fandom Fire | WebGL AI roast | No personal output, no ElevenLabs, no keepsake |
| Himanshu Kumar | Solana | No visual output |
| Generic dashboards | Various | Forgettable, no shareability |

**Our position:** the only submission producing a beautiful, personalized, downloadable, shareable
artifact with two emotional registers, two tonal registers, real narration, an original music score,
and a local history — with zero backend, zero cost beyond the two AI API calls.

---

## 4. User Flow (Final, v2)

```
┌──────────────────────────────────────────────────────────────┐
│  NAV BAR (persistent, all phases)                             │
│  🍷🔥 Passion Uncorked      [🔇/🔊]  [🖼 gallery+badge]  [⚙]   │
├──────────────────────────────────────────────────────────────┤
│  LANDING                                                       │
│  🍷🔥 Passion Uncorked                                          │
│  "Every passion is either aged or forged."                    │
│  [ e.g. "open source" ]                                        │
│  [🍷 Age it in wine]  [🔥 Forge it]                             │
│  — Try these passions —                                        │
│  [football] [photography] [coding] [cooking] [music]           │
│  Powered by Google AI + ElevenLabs                              │
└──────────────────────────────────────────────────────────────┘
           │ (vessel + submit)
           ▼
┌──────────────────────────────────────────────────────────────┐
│  LOADING — vessel-themed animation + cycling copy               │
│  (adds "Painting the label…" as a 5th line when AI artwork is   │
│  enabled in settings)                                           │
└──────────────────────────────────────────────────────────────┘
           │ (Gemini done; ElevenLabs + art run in parallel,      │
           │  non-blocking — failures fall back silently)         │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  RESULT                                                        │
│  [Bottle/anvil silhouette — OR an AI photo if artwork is on]    │
│  [Label — seal stamps/burns in, tilts in 3D on mouse hover]     │
│  [Audio auto-plays once, at user's configured volume]           │
│  "Your [vintage/forge mark] of: [passion]"                     │
│  [🔊 Replay]  [⬇ Download]  [🐦 Share on X]  [↺ Try Another]     │
│  → generation is saved to the local Gallery automatically       │
└──────────────────────────────────────────────────────────────┘
```

**Persistent side panels (either phase):**
- **Settings drawer** (⚙): narration on/off + volume, per-vessel narrator voice, ambient sound on/off +
  volume, motion (full/reduced), tone (classy/sassy), creativity slider, manual accent-color override,
  AI artwork toggle.
- **Gallery drawer** (🖼): every successful generation (capped at 20, oldest dropped), click to revisit
  instantly with **zero new API calls**, per-item delete, clear-all.

**Passion chips** fill the input but do **not** auto-submit — the user still needs to pick a vessel.

---

## 5. Design System

### 5.1 Aesthetic Direction

**Wine — Maison de Champagne meets 1920s private cellar archive.** Dusty amber candlelight, copper
foil on aged parchment, wax seals, hand-pressed type.

**Fire — a mythic smithy's forge-mark register.** Charcoal dark, ember glow, hard iron edges,
brand-mark instead of wax seal.

**Shared signature element:** every artifact has a unique accent color derived from Gemini's
`color_mood` field (or a manual override chosen in Settings). Same layout, different soul, in both
vessels.

**Design anti-targets (both vessels):** no white backgrounds, no default blue, no rounded cards (fire
has zero radius; wine's radius is minimal, 2–3px), no gradients except within bottle glass/forge glow
and the flame layers, no template-looking anything.

### 5.2 App Chrome Color Palette

`src/config/vessels.js` holds these as **plain hex strings**, not CSS custom-property references. This
matters: several components build translucent borders/backgrounds by string-concatenating an alpha
suffix onto the color (e.g. `` `${v.accentUi}66` ``). That only produces valid CSS if the base value is
a real hex color — `var(--wine-copper)66` is not valid CSS and silently fails, which is exactly what
happened in an earlier revision (the nav bar background rendered pure white until this was fixed). Any
future addition to this palette **must** use hex, not a `var(...)` reference, for this reason.

| Name | Hex | Usage | Vessel |
|---|---|---|---|
| Cellar Black | `#1A1209` | App background | Wine |
| Aged Parchment | `#F2E8D5` | Label base, text on dark | Wine |
| Château Burgundy | `#6B1A2A` | Default border, wax seal, CTA button | Wine |
| Copper Foil | `#B87333` | Château name, dividers, UI accents | Wine |
| Ink | `#2C1810` | Body text on label | Wine |
| Bottle Glass | `#1C3A2B` | Wine bottle body | Wine |
| Gold Highlight | `#D4AF37` | Seal details | Wine |
| Forge Charcoal | `#1A1512` | App background | Fire |
| Ash Plate | `#C9BFB5` | Label base, text on dark | Fire |
| Ember Red | `#E8531C` | Default border, brand mark, CTA button | Fire |
| Ember Bright | `#FF8A3D` | Forge-mark name, dividers, glow shadow | Fire |
| Iron | `#3D3835` | Body text on label | Fire |
| Anvil Steel | `#2A2622` | Anvil/blade silhouette body | Fire |

`Inter` (400/500) is shared across both vessels for all app-chrome UI. Only the label typography
differs (§5.4).

### 5.3 Dynamic Label Accent Colors

Gemini returns one of 8 mood values regardless of vessel; each vessel maps the same enum to its own
palette family. The user can override this in Settings (`accentOverride`, §9) — when set to anything
other than `'auto'`, it replaces `labelData.color_mood` at the point of lookup, everywhere the accent
color is computed (Label, VesselBottle, ResultScreen, image-generation prompts).

| mood value | Wine accent | Fire accent | Example passions |
|---|---|---|---|
| `fire` | `#C0392B` | `#E8531C` | football, F1, gaming, boxing |
| `earth` | `#8B6914` | `#8B4513` | gardening, cooking, hiking, farming |
| `ocean` | `#1A5276` | `#2E5C6E` | sailing, diving, surfing, fishing |
| `night` | `#2C3E50` | `#4A3728` | astronomy, jazz, coding, nightlife |
| `silver` | `#808B96` | `#8C8C8C` | photography, film, architecture |
| `forest` | `#1E8449` | `#556B2F` | open source, ecology, tea, nature |
| `gold` | `#D4AC0D` | `#C9942A` | chess, classical music, literature |
| `rose` | `#943126` | `#A13D2B` | love, wine, poetry, dance |

`src/utils/colorMood.js` (complete, unchanged since v1):
```javascript
const WINE_MOODS = {
  fire: '#C0392B', earth: '#8B6914', ocean: '#1A5276', night: '#2C3E50',
  silver: '#808B96', forest: '#1E8449', gold: '#D4AC0D', rose: '#943126',
};

const FIRE_MOODS = {
  fire: '#E8531C', earth: '#8B4513', ocean: '#2E5C6E', night: '#4A3728',
  silver: '#8C8C8C', forest: '#556B2F', gold: '#C9942A', rose: '#A13D2B',
};

export function getAccentColor(vessel, colorMood) {
  const table = vessel === 'fire' ? FIRE_MOODS : WINE_MOODS;
  return table[colorMood] || (vessel === 'fire' ? '#E8531C' : '#6B1A2A');
}
```

### 5.4 Typography

| Role | Wine | Fire |
|---|---|---|
| Title (château/forge name) | Cormorant Garamond, 700 italic, 22px | Cinzel, 700, letter-spacing 2, 22px |
| Subtitle (domain/smith title) | Cormorant Garamond, 400, 13px | same |
| Section labels | Cormorant Garamond, 600, letter-spacing 2.5, 9px | same |
| Body text | EB Garamond, 400, 12–12.5px | same |
| Closing note | EB Garamond, 400 italic, 12px | same |
| App UI (both) | Inter, 400/500 | same |
| App tagline (both) | Cormorant Garamond, 500 italic, 22px | same |

Google Fonts, single link, Latin subset only (`index.html`):
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&family=EB+Garamond:ital,wght@0,400;1,400&family=Cinzel:wght@700&family=Oswald:wght@300;500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```

### 5.5 Label SVG — Complete Anatomy

ViewBox: `0 0 400 560`. Wine adds `✦` flourishes around the title and 2–3px corner radius; fire strips
ornamentation and uses `rx=0`. Both share the same y-coordinates and structure — one component
(`Label.jsx`, §16.5), a per-vessel field map (`VESSELS[vessel].fields`) swaps which JSON key renders
where and what each section is labeled (`TASTING NOTES` vs `TEMPER NOTES`, etc).

**v2 addition:** an optional AI-generated background image layer sits between the parchment/ash base
rect and the accent-colored border, at 35% opacity with `mix-blend-mode: multiply` so label text always
stays legible on top of it (§12.1).

**Text wrapping rule (both vessels):** all body strings pass through `wrapText(str, maxChars=33,
maxLines=3)` (§16.9) — splits on word boundaries, truncates overflow with an ellipsis.

### 5.6 Bottle / Anvil SVG Shell (Refined, v2)

Both silhouettes live in one component, `VesselBottle.jsx` (§11), switching on a `vessel` prop.
`viewBox="0 0 180 500"` for both.

**Wine bottle — refined anatomy:**
- Glass shell: a single gradient-filled path (`linearGradient`, dark-to-mid-to-dark green) instead of a
  flat fill, for real dimensional glass.
- Liquid: a rect clipped to the bottle's silhouette, tinted with the current accent color, animated
  in with a scale-Y reveal.
- **Liquid meniscus** — a thin accent-colored ellipse at the liquid's surface that continuously
  "breathes" (`scaleX` oscillation) so the liquid doesn't look static.
- **5 rising bubbles** — small circles inside the clipped liquid area, each with its own size, delay,
  and duration, looping continuously.
- **Foil capsule** — a gold-toned band wrapped around the neck below the cork, with a lighter top edge
  and darker bottom edge for a foil-wrap look.
- **Cork** — a rounded-rect body + ellipse cap highlight + rim shadow, that pops off and flies/fades on
  reveal (separate from the old infinite-loop cork animation used only on the *loading* screen).
- A diagonal glass-shine sweep plays once on reveal.

**Fire anvil — refined anatomy:**
- Anvil block shapes (top plate, tapered horn, waist, base) — unchanged geometry from v1.
- **Gradient flames** — an outer flame path uses a `radialGradient` from the accent color to a pale
  yellow-white tip; an inner flame path uses a `linearGradient` from warm gold to near-white; a third
  thin **flame-core** path sits inside both, solid near-white, flickering independently, for visual
  depth that a flat single-color fill couldn't give.
- **Glow bloom** — a blurred (`feGaussianBlur`, stdDeviation 7) accent-colored ellipse sits behind the
  flame layers, pulsing gently, simulating light cast from the fire.
- **6 rising embers** (up from 4 in v1) with varied radius, drift direction, and stagger delay.
- **Flame strength** — derived from the AI-written `intensity` field's wording (`deriveFlameStrength`,
  §11): words like "white-hot"/"blazing" scale the whole flame group up (1.25×), "ember"/"quiet"/"faint"
  scale it down (0.75×), otherwise 1×. The flame visibly reacts to what Gemini actually wrote, not a
  fixed constant.
- Hammer-strike flash (a bright circle that flashes and fades) + an expanding shockwave ring, timed to
  land just before the ember seal burns in on the label.

### 5.7 Animations (Complete List, v2)

All animation class names, their keyframes, and their reduced-motion/data-motion gating live in
`src/index.css` (§17). Summary of every animation in the app:

| Class | Purpose | Duration | Loop? |
|---|---|---|---|
| `.label-card` | Label reveal (translateY + rotateX + scale) | 0.85s | once |
| `.wax-seal` | Wine seal stamp-in (overshoot scale/rotate) | 0.6s | once |
| `.ember-seal` | Fire seal burn-in (brightness/blur ramp) | 0.65s | once |
| `.cork-pop` | Loading-screen infinite cork bounce | 1.8s | infinite |
| `.ember-pulse` | Loading-screen infinite ember glow | 1.4s | infinite |
| `.float-particle` | Landing-screen dust/ember particles | 6s | infinite |
| `.progress-fill` | Loading-screen progress bar | 3.5s | once |
| `.fade-in` | Generic fade-in (errors, loading copy swap) | 0.3s | once |
| `.liquid-fill` | Wine liquid reveal (scaleY) | 1.4s | once |
| `.cork-fly-reveal` | Result-screen cork pop-and-fly | 1s | once |
| `.glass-shine` | Diagonal shine sweep across the bottle | 1.6s | once |
| `.flame-flicker` | Flame layer organic movement | 2.2s | infinite |
| `.ember-spark` | Ember rise-and-fade | 1.6s | infinite |
| `.hammer-flash` | Fire seal flash | 0.5s | once |
| `.shockwave-ring` | Fire seal expanding ring | 0.7s | once |
| `.wine-bubble` | Rising bubbles in the liquid | 3.6–4.6s (varies) | infinite |
| `.liquid-meniscus` | Liquid surface breathing | 3s | infinite |
| `.flame-glow` | Glow bloom pulse behind flame | 2.4s | infinite |
| `.flame-core` | Inner bright flame core flicker | 1.6s | infinite |
| `.phase-fade` | Cross-fade between landing/loading/result | 0.4s | once, per phase change |
| `.drawer-panel` | Settings/Gallery drawer slide-in | 0.25s | once |
| `.tilt-container` (not a keyframe — a transition) | 3D label tilt-on-hover | 0.15s transition | continuous while hovering |

**Reduced motion — two independent layers, either one wins:**
1. `@media (prefers-reduced-motion: reduce)` — OS-level preference, always respected.
2. `[data-motion="reduced"]` — the app's own **Motion** setting in Settings (`settings.motionIntensity`),
   applied as a `data-motion` attribute on the app's root `<div>` in `App.jsx`.

Both blocks disable the exact same class list — animation, opacity, and transform are all forced to
their resting state. `VesselBottle.jsx` also accepts a `reducedMotion` prop directly, so continuous
loop classes (flame flicker, embers, bubbles) are omitted from the className computation entirely when
either gate is active, not just visually frozen by CSS.

### 5.8 Loading Screen Copy (cycling every 900ms)

**Wine:** "Selecting your terroir…" → "Ageing your passion underground…" → "Consulting the Grand Cru
committee…" → "Applying the wax seal…"

**Fire:** "Stoking the forge…" → "Tempering your passion in the coals…" → "Consulting the Order of the
Anvil…" → "Striking the mark…"

**v2 addition:** when `settings.aiArtEnabled` is true, a 5th line — "Painting the label…" — is appended
to whichever vessel's list, computed via `useMemo` in `LoadingScreen.jsx`.

### 5.9 Responsive Layout

| Breakpoint | Layout |
|---|---|
| `>900px` | Side-by-side: bottle/anvil (or AI photo) left, label right, controls below label |
| `640–900px` | Stacked: label centred, silhouette hidden, controls below |
| `<640px` | Label scales to 88vw. Controls stack. |

The persistent nav bar (56px, fixed) is accounted for via `calc(100vh - 56px)` on every full-height
screen container and a 56px top padding wrapper in `App.jsx` — getting this wrong reintroduces a small
page-overflow scroll, which was caught and fixed during implementation.

---

## 6. Architecture

### 6.1 Tech Stack

```
Frontend:        React 18 + Vite 5
Styling:         Tailwind CSS 3 + custom CSS (animations, SVG labels)
AI Content:      Google Gemini 2.5 Flash via @google/genai ^2.11.0
AI Voice:        ElevenLabs eleven_flash_v2_5 via official @elevenlabs/elevenlabs-js SDK (lazy-loaded)
AI Artwork:      Gemini 2.5 Flash Image via @google/genai (gated, requires paid key)
Ambient Music:   Web Audio API, hand-composed, zero dependencies
PNG Export:      html2canvas 1.4
State:           React Context (settings) + component state + localStorage (settings + gallery)
Deploy:          Vercel (zero config, free)
```

### 6.2 File Structure (Actual, Final)

```
passion-uncorked/
├── public/
│   └── favicon.svg              # Wine glass + spark dual icon
├── src/
│   ├── App.jsx                  # Root state machine + settings/gallery wiring + ambient crossfade
│   ├── main.jsx                 # Wraps <App/> in <SettingsProvider>
│   ├── index.css                # Global styles, font imports, CSS vars, every animation keyframe
│   │
│   ├── config/
│   │   └── vessels.js           # Palette (plain hex), fonts, field-name map, loading copy per vessel
│   │
│   ├── context/
│   │   └── SettingsContext.jsx  # Settings provider/hook, localStorage-persisted
│   │
│   ├── hooks/
│   │   └── useTilt.js           # Plain pointer-driven 3D tilt hook (no library)
│   │
│   ├── components/
│   │   ├── LandingScreen.jsx    # Hero + input + vessel picker + passion chips + particles
│   │   ├── LoadingScreen.jsx    # Vessel-aware animation + cycling copy (+ AI-art line)
│   │   ├── ResultScreen.jsx     # Layout container: silhouette/AI-photo + label + controls
│   │   ├── VesselBottle.jsx     # Refined SVG bottle/anvil — gradients, bubbles, glow, embers
│   │   ├── Label.jsx            # SVG label — one component, vessel prop + accentOverride + bg image
│   │   ├── Seal.jsx             # WaxSeal / EmberSeal switch
│   │   ├── Controls.jsx         # Replay + Download + Share + Reset
│   │   ├── NavBar.jsx           # Persistent top bar: brand/reset, ambient mute, gallery, settings
│   │   ├── Drawer.jsx           # Shared slide-in panel primitive (backdrop, Esc-to-close, focus)
│   │   ├── SettingsPanel.jsx    # All user-configurable settings, built on Drawer
│   │   └── GalleryPanel.jsx     # Local generation history, built on Drawer
│   │
│   ├── services/
│   │   ├── gemini.js            # Label JSON generation — tone/temperature aware, repair+retry
│   │   ├── elevenlabs.js        # TTS via lazy-loaded official SDK + premade-voice listing
│   │   ├── imagegen.js          # AI background texture + full AI vessel photo (gated)
│   │   └── ambientSound.js      # Original synthesized music score, Web Audio API
│   │
│   └── utils/
│       ├── download.js          # html2canvas PNG export
│       ├── share.js             # Twitter/X share URL builder, vessel-aware copy
│       ├── wrapText.js          # SVG text line-breaker
│       ├── colorMood.js         # Maps color_mood + vessel → accent hex
│       └── useLocalStorageState.js  # Generic localStorage-backed useState
│
├── .env                          # VITE_GEMINI_KEY, VITE_ELEVENLABS_KEY (never commit)
├── .env.example                  # Safe to commit (empty values)
├── .gitignore
├── index.html                    # OG + Twitter meta tags, font link, favicon
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 7. Gemini API Specification (Label Content)

### 7.1 SDK and Model

```bash
npm install @google/genai@^2.11.0
```

**Model:** `gemini-2.5-flash` — confirmed live against the account's actual `/v1beta/models` listing.
Do not assume a model name from documentation or memory; list-check it against the real key before
committing to it in code, the same way this project caught `gemini-3.5-flash` not existing.

### 7.2 System Instructions — Two Tones × Two Vessels

`src/services/gemini.js` defines **four** system instructions, not two — a classy and a sassy variant
per vessel, selected at request time by `settings.tone`:

```javascript
const CLASSY_SYSTEM_INSTRUCTIONS = {
  wine: `You are the cellar master at Maison de la Passion — a legendary fictional
winery that bottles human obsessions rather than grapes. You write wine labels that
are poetic, witty, and deeply personal. Elegant but warm, never pretentious.
Respond with valid JSON only. No markdown. No explanation. No preamble.`,

  fire: `You are the master smith at the Forge of Passion — a legendary fictional
smithy that forges human obsessions into blades rather than steel alone. You write
forge-mark copy that is intense, precise, and mythic but grounded in real detail of
the passion. Use forging language (heat, strike, temper, edge, quench) without being
cheesy. Respond with valid JSON only. No markdown. No explanation. No preamble.`,
};

const SASSY_SYSTEM_INSTRUCTIONS = {
  wine: `You are the cellar master at Maison de la Passion, and frankly, you're a
little tired of pretending every passion deserves a gentle write-up. You write wine
labels that lovingly roast the person's passion — sharp, funny, a little savage —
while still sounding like an expert who genuinely knows wine. Think a sommelier who
also does stand-up. Affectionate teasing, not cruelty. Still deeply specific to the
passion given. Respond with valid JSON only. No markdown. No explanation. No preamble.`,

  fire: `You are the master smith at the Forge of Passion, and you have zero patience
for soft copy. You write forge-mark descriptions that roast the person's passion with
blunt, cocky, trash-talking bravado — like a smith who's seen it all and isn't
impressed, but still respects the craft enough to nail the details. Funny, savage,
still grounded in real specifics of the passion given. Use forging language (heat,
strike, temper, edge, quench). Respond with valid JSON only. No markdown. No
explanation. No preamble.`,
};

const SYSTEM_INSTRUCTIONS_BY_TONE = {
  classy: CLASSY_SYSTEM_INSTRUCTIONS,
  sassy: SASSY_SYSTEM_INSTRUCTIONS,
};
```

### 7.3 Prompt Template (vessel-aware, both return the same `color_mood` enum)

```javascript
const buildPrompt = (passion, vessel) => vessel === 'fire' ? `
Create a forge mark for someone passionate about: "${passion}"

Return ONLY a JSON object with these exact fields:
{
  "forge_name": "Evocative fictional forge/smithy name capturing this passion (max 8 words)",
  "smith_title": "Order/guild title (max 6 words, e.g. 'Forged by the Order of...')",
  "year_forged": <integer year 1975-2023, when this passion likely ignited>,
  "temper_notes": "2-3 sentences describing this passion in forging language: heat, strike, temper, edge. Max 55 words.",
  "intensity": "One-line intensity statement, e.g. 'White-Hot · One Blade Forged'",
  "tempered_with": "Best tempered with: 3 short items, comma-separated",
  "smiths_mark": "One punchy closing sentence a smith would carve. Max 18 words. In quotes.",
  "tts_script": "The temper_notes rewritten for spoken audio, deeper register. Max 45 words.",
  "color_mood": "Exactly one of: fire, earth, ocean, night, silver, forest, gold, rose"
}` : `
Create a wine label for someone passionate about: "${passion}"

Return ONLY a JSON object with these exact fields:
{
  "chateau": "Poetic French château name capturing this passion (max 8 words)",
  "domain": "Estate domain name (max 6 words, start with 'Domaine de')",
  "vintage": <integer year 1975-2023, when this passion likely began>,
  "tasting_notes": "2-3 sentences describing this passion as a wine. Max 55 words.",
  "rarity": "One-line rarity statement, e.g. 'Legendary · Only 1 bottle exists'",
  "pairing": "Best enjoyed with: 3 short items, comma-separated",
  "collectors_note": "One punchy sentence a collector would write. Max 18 words. In quotes.",
  "tts_script": "The tasting_notes rewritten for spoken audio. Warm, measured. Max 45 words.",
  "color_mood": "Exactly one of: fire, earth, ocean, night, silver, forest, gold, rose"
}`;
```

### 7.4 Generation Config

```javascript
{
  systemInstruction: systemInstructions[vessel],   // classy or sassy, per settings.tone
  temperature,                                     // settings.temperature, 0.7–1.4, default 1.1
  maxOutputTokens: 500,
  responseMimeType: 'application/json',
  thinkingConfig: { thinkingBudget: 0 },            // see §7.5 — critical
}
```

### 7.5 Critical gotcha: `gemini-2.5-flash` is a thinking model

This was diagnosed empirically, not assumed. Without `thinkingConfig: { thinkingBudget: 0 }`, the model
spends its entire `maxOutputTokens` budget on invisible "thinking" tokens before writing any visible
text — a live test against the real API showed `thoughtsTokenCount: 333`+ consumed out of a 350-token
cap, leaving **zero** tokens for the actual JSON, which surfaces in the app as `Error: Empty response
from Gemini`. Setting `thinkingBudget: 0` disables that invisible reasoning pass entirely — and
counter-intuitively **reduces** total token usage (a real before/after measurement: 394 → 327 tokens for
an equivalent prompt), since none of the budget is spent on discarded reasoning.

**A second, SDK-specific trap:** `@google/genai@0.7.0`'s request serializer only forwarded
`thinkingConfig.includeThoughts` to the API — it silently dropped `thinkingBudget` entirely, so the
"fix" above did nothing until the SDK was upgraded to `^2.11.0`, whose serializer forwards the whole
`thinkingConfig` object as-is. If thinking-model output ever mysteriously "stops working" after this
fix is applied, check the installed SDK version first.

`maxOutputTokens` is set to 500 (up from an initial 350) — real responses measured 260–334 candidate
tokens with `thinkingBudget: 0`, and 350 was empirically shown to sometimes truncate mid-JSON.

### 7.6 Reliability: repair-then-retry for truncated JSON

Even with `finishReason: STOP` (not `MAX_TOKENS`), Gemini occasionally drops the final closing brace (or
a closing quote) of the JSON object — a real, observed model quirk, not a hypothetical. `gemini.js`
handles this in two layers:

```javascript
// Occasionally the model reports finishReason STOP but drops the final
// closing brace (or quote) of the JSON object. Repair the common cases
// before giving up and re-requesting.
function repairTruncatedJson(str) {
  let s = str.trim().replace(/,\s*$/, '');
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  const openBraces = (s.match(/{/g) || []).length;
  const closeBraces = (s.match(/}/g) || []).length;
  if (openBraces > closeBraces) s += '}'.repeat(openBraces - closeBraces);
  return s;
}
```

If the repair still fails to produce parseable JSON, `generateLabelData` retries the entire generation
once with a fresh call — cheaper and more correct than trying to guess-patch a genuinely garbled
response, and empirically brought a measured failure rate down to 0 across a paced batch test (5/5
after the fix, vs. earlier failures directly attributable to this exact quirk).

### 7.7 Complete Service (`src/services/gemini.js`, exact current file)

```javascript
import { GoogleGenAI } from '@google/genai';

const CLASSY_SYSTEM_INSTRUCTIONS = {
  wine: `You are the cellar master at Maison de la Passion — a legendary fictional
winery that bottles human obsessions rather than grapes. You write wine labels that
are poetic, witty, and deeply personal. Elegant but warm, never pretentious.
Respond with valid JSON only. No markdown. No explanation. No preamble.`,

  fire: `You are the master smith at the Forge of Passion — a legendary fictional
smithy that forges human obsessions into blades rather than steel alone. You write
forge-mark copy that is intense, precise, and mythic but grounded in real detail of
the passion. Use forging language (heat, strike, temper, edge, quench) without being
cheesy. Respond with valid JSON only. No markdown. No explanation. No preamble.`,
};

const SASSY_SYSTEM_INSTRUCTIONS = {
  wine: `You are the cellar master at Maison de la Passion, and frankly, you're a
little tired of pretending every passion deserves a gentle write-up. You write wine
labels that lovingly roast the person's passion — sharp, funny, a little savage —
while still sounding like an expert who genuinely knows wine. Think a sommelier who
also does stand-up. Affectionate teasing, not cruelty. Still deeply specific to the
passion given. Respond with valid JSON only. No markdown. No explanation. No preamble.`,

  fire: `You are the master smith at the Forge of Passion, and you have zero patience
for soft copy. You write forge-mark descriptions that roast the person's passion with
blunt, cocky, trash-talking bravado — like a smith who's seen it all and isn't
impressed, but still respects the craft enough to nail the details. Funny, savage,
still grounded in real specifics of the passion given. Use forging language (heat,
strike, temper, edge, quench). Respond with valid JSON only. No markdown. No
explanation. No preamble.`,
};

const SYSTEM_INSTRUCTIONS_BY_TONE = {
  classy: CLASSY_SYSTEM_INSTRUCTIONS,
  sassy: SASSY_SYSTEM_INSTRUCTIONS,
};

const buildPrompt = (passion, vessel) => vessel === 'fire' ? `
Create a forge mark for someone passionate about: "${passion}"

Return ONLY a JSON object with these exact fields:
{
  "forge_name": "Evocative fictional forge/smithy name capturing this passion (max 8 words)",
  "smith_title": "Order/guild title (max 6 words, e.g. 'Forged by the Order of...')",
  "year_forged": <integer year 1975-2023, when this passion likely ignited>,
  "temper_notes": "2-3 sentences describing this passion in forging language: heat, strike, temper, edge. Max 55 words.",
  "intensity": "One-line intensity statement, e.g. 'White-Hot · One Blade Forged'",
  "tempered_with": "Best tempered with: 3 short items, comma-separated",
  "smiths_mark": "One punchy closing sentence a smith would carve. Max 18 words. In quotes.",
  "tts_script": "The temper_notes rewritten for spoken audio, deeper register. Max 45 words.",
  "color_mood": "Exactly one of: fire, earth, ocean, night, silver, forest, gold, rose"
}` : `
Create a wine label for someone passionate about: "${passion}"

Return ONLY a JSON object with these exact fields:
{
  "chateau": "Poetic French château name capturing this passion (max 8 words)",
  "domain": "Estate domain name (max 6 words, start with 'Domaine de')",
  "vintage": <integer year 1975-2023, when this passion likely began>,
  "tasting_notes": "2-3 sentences describing this passion as a wine. Max 55 words.",
  "rarity": "One-line rarity statement, e.g. 'Legendary · Only 1 bottle exists'",
  "pairing": "Best enjoyed with: 3 short items, comma-separated",
  "collectors_note": "One punchy sentence a collector would write. Max 18 words. In quotes.",
  "tts_script": "The tasting_notes rewritten for spoken audio. Warm, measured. Max 45 words.",
  "color_mood": "Exactly one of: fire, earth, ocean, night, silver, forest, gold, rose"
}`;

// Occasionally the model reports finishReason STOP but drops the final
// closing brace (or quote) of the JSON object. Repair the common cases
// before giving up and re-requesting.
function repairTruncatedJson(str) {
  let s = str.trim().replace(/,\s*$/, '');
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  const openBraces = (s.match(/{/g) || []).length;
  const closeBraces = (s.match(/}/g) || []).length;
  if (openBraces > closeBraces) s += '}'.repeat(openBraces - closeBraces);
  return s;
}

async function requestLabelData(passion, vessel, { temperature = 1.1, tone = 'classy' } = {}) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const systemInstructions = SYSTEM_INSTRUCTIONS_BY_TONE[tone] || CLASSY_SYSTEM_INSTRUCTIONS;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: buildPrompt(passion, vessel),
    config: {
      systemInstruction: systemInstructions[vessel],
      temperature,
      maxOutputTokens: 500,
      responseMimeType: 'application/json',
      // This is a thinking model — without this, thinking tokens consume
      // the entire output budget and no visible text comes back.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');

  // Sanitize: strip markdown fences if they sneak through
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    return JSON.parse(repairTruncatedJson(clean));
  }
}

export async function generateLabelData(passion, vessel, options) {
  try {
    return await requestLabelData(passion, vessel, options);
  } catch {
    // Malformed JSON survives the repair attempt, or the model dropped
    // more than a trailing brace — retry once with a fresh generation
    // rather than surfacing a one-off model hiccup to the user.
    return await requestLabelData(passion, vessel, options);
  }
}
```

### 7.8 Example Outputs (real, generated during testing)

**Fire, classy tone, input `"competitive chess"`:**
```json
{
  "forge_name": "The Grandmaster's Anvil of Sixty-Four Squares",
  "smith_title": "Forged by the Order of Eight",
  "year_forged": 1997,
  "temper_notes": "Struck under midnight lamps, quenched in a hundred silent calculations. Tempered until it stops trembling before the endgame.",
  "intensity": "Cold-Iron Precision · Sixty-Four Folds",
  "tempered_with": "Absolute silence, calculated sacrifice, the final checkmate",
  "smiths_mark": "\"In the quiet forge of the mind, the king always falls first.\"",
  "tts_script": "Forged in the quiet friction of cold steel...",
  "color_mood": "silver"
}
```

**Wine, classy tone, input `"gardening"`:**
```json
{
  "chateau": "Château de la Terre Retrouvée",
  "domain": "Domaine de l'Humus Doré",
  "vintage": 1994,
  "tasting_notes": "A grounding pour of wet clay and sun-warmed tomato leaf, opening into vibrant elderflower and bruised mint...",
  "rarity": "Harvested by hand under the spring equinox · 180 bottles bottled",
  "pairing": "soiled fingernails, the first morning thrush, a ripe tomato eaten warm from the vine",
  "collectors_note": "\"A bottled miracle of patience—this vintage tastes exactly like the quiet triumph of the first green sprout.\"",
  "tts_script": "A grounding pour of wet clay and warm tomato leaf...",
  "color_mood": "forest"
}
```

---

## 8. ElevenLabs API Specification (Narration)

### 8.1 SDK: official, but lazy-loaded

```bash
npm install @elevenlabs/elevenlabs-js
```

⚠️ **Bundle-size trap, measured, not theoretical.** Importing `ElevenLabsClient` at the top level pulls
in the *entire* SDK — not just text-to-speech, but realtime/WebSocket streaming, speech-to-text, and an
"agents platform" client. Measured before/after in this exact project:

| | Eager top-level import | Lazy dynamic `import()` |
|---|---|---|
| Modules transformed | 13,460 | 13,460 (same — build still processes them) |
| Main JS bundle | 4,649 KB | **745 KB** (same as before adding the SDK at all) |
| Gzipped main bundle | 547 KB | **173 KB** |
| Separate lazy chunk | — | 3,900 KB (only fetched when TTS actually runs) |
| Build time | ~2m20s | ~45–70s |

**Fix:** wrap the client construction in a dynamic `import()`, cached as a singleton promise, so the
heavy package only downloads the moment a user actually submits a passion (or opens Settings and
triggers a voice-list fetch) — never on initial page load.

### 8.2 Playback: do NOT use the SDK's `play()` helper

The SDK ships a `play(audio)` convenience helper (seen in ElevenLabs' own Node.js quickstart snippets).
**It is Node-only** — it shells out to a system audio player (`ffplay`/`afplay`/etc.) via
`child_process`, which does not exist in a browser. Vite's build log confirms this by externalizing
`node:child_process`, `node:stream`, `node:events`, `node:crypto`, `node:http` for the browser build —
those are exactly the modules `play()` depends on.

**What to use instead:** `client.textToSpeech.convert()` resolves a standard, browser-native
`ReadableStream<Uint8Array>` (confirmed from the SDK's own `.d.ts` — `HttpResponsePromise<ReadableStream<Uint8Array>>`).
Convert it to a Blob via the Fetch API's `Response` wrapper and hand it to a normal `<audio>`/`Audio()`
element — which is what this app already needed anyway, for the volume slider, replay button, and
autoplay-policy fallback.

### 8.3 Voice IDs and Settings

| Voice | ID | Character | Vessel |
|---|---|---|---|
| **Adam** | `pNInz6obpgDQGcFmaJgB` | Deep, warm, authoritative | 🍷 Wine (default) |
| **Josh** | `TxGEqnHWrfWFTfGW9XjX` | Deeper, grittier register | 🔥 Fire (default) |

Both are premade, free-tier-API-accessible voices (paid-tier-only Voice Library voices like "Daniel"
will 401/fail on a free key — this was a real bug in an earlier draft of this project, long since
fixed). The user can override either default from the Settings drawer's voice picker, populated live
from the account's actual available premade voices (§8.5).

```javascript
const VOICE_SETTINGS = {
  wine: { stability: 0.68, similarityBoost: 0.82, style: 0.12, useSpeakerBoost: true },
  fire: { stability: 0.5,  similarityBoost: 0.80, style: 0.40, useSpeakerBoost: true },
};
```

**Model:** `eleven_flash_v2_5` (ultra-low latency). **Output format:** `mp3_44100_128`.

Note the SDK's field names are **camelCase** (`similarityBoost`, `useSpeakerBoost`, `modelId`,
`outputFormat`) — the raw REST API uses snake_case (`similarity_boost`, `use_speaker_boost`,
`model_id`). Mixing these up (e.g. copy-pasting a raw-`fetch` example's body into an SDK call) silently
sends the wrong field names, since the SDK doesn't validate unknown keys client-side.

### 8.4 Complete Service (`src/services/elevenlabs.js`, exact current file)

```javascript
const VOICE_IDS = {
  wine: 'pNInz6obpgDQGcFmaJgB', // Adam — premade, free tier
  fire: 'TxGEqnHWrfWFTfGW9XjX', // Josh — premade, free tier
};

const VOICE_SETTINGS = {
  wine: { stability: 0.68, similarityBoost: 0.82, style: 0.12, useSpeakerBoost: true },
  fire: { stability: 0.5,  similarityBoost: 0.80, style: 0.40, useSpeakerBoost: true },
};

// The full SDK bundles far more than text-to-speech (realtime, speech-to-text,
// an agents platform client) — ~4.6MB before gzip. Dynamic import keeps that
// weight out of the initial bundle; it only downloads the moment a user
// actually submits a passion, not on first page load.
let clientPromise = null;
async function getClient() {
  if (!clientPromise) {
    clientPromise = import('@elevenlabs/elevenlabs-js').then(
      ({ ElevenLabsClient }) => new ElevenLabsClient({ apiKey: import.meta.env.VITE_ELEVENLABS_KEY })
    );
  }
  return clientPromise;
}

export async function generateVoiceAudio(ttsScript, vessel, voiceIdOverride) {
  const voiceId = voiceIdOverride || VOICE_IDS[vessel];

  let stream;
  try {
    const client = await getClient();
    stream = await client.textToSpeech.convert(voiceId, {
      text: ttsScript,
      modelId: 'eleven_flash_v2_5',
      outputFormat: 'mp3_44100_128',
      voiceSettings: VOICE_SETTINGS[vessel],
    });
  } catch (err) {
    // The SDK throws rich ElevenLabsError subclasses with a .body.detail.message
    throw new Error(err?.body?.detail?.message || err.message || 'ElevenLabs request failed');
  }

  // convert() resolves a browser-native ReadableStream<Uint8Array> — not the
  // SDK's play() helper, which shells out to a system audio player via
  // child_process and only works in Node, not a browser.
  const audioBlob = await new Response(stream).blob();
  return URL.createObjectURL(audioBlob);
}

let voicesCache = null;

// Fetches the account's available premade voices so Settings can offer a
// per-vessel narrator choice beyond the two hardcoded defaults. Cached for
// the session — this is a low-value call to repeat on every drawer open.
export async function fetchPremadeVoices() {
  if (voicesCache) return voicesCache;

  const client = await getClient();
  const { voices } = await client.voices.getAll();
  voicesCache = (voices || [])
    .filter((v) => v.category === 'premade')
    .map((v) => ({ voiceId: v.voiceId, name: v.name }));
  return voicesCache;
}

export const DEFAULT_VOICE_IDS = VOICE_IDS;
```

### 8.5 Voice Listing for the Settings Picker

`fetchPremadeVoices()` calls the SDK's `voices.getAll()`, filters to `category === 'premade'`
(confirmed enum value from `VoiceCategory` in the SDK's types: `generated | cloned | premade |
professional | famous | high_quality`), and caches the result for the session. `SettingsPanel.jsx`
calls this lazily — only when the drawer is actually opened, not on app load — and falls back
gracefully (shows just the two hardcoded defaults with a small note) if the fetch fails.

### 8.6 Audio Playback — Autoplay, Volume, Replay

```javascript
useEffect(() => {
  if (!audioUrl || !narrationEnabled) return;
  const audio = new Audio(audioUrl);
  audio.volume = volume; // from settings.volume, user-configurable, default 0.45
  audio.play().catch(() => {}); // Silently swallow autoplay-policy errors; Replay button still works
}, [audioUrl, narrationEnabled, volume]);
```

The Replay button in `Controls.jsx` is only rendered when `audioUrl` is truthy — so if narration is
disabled in Settings, or ElevenLabs fails/has no quota, the button simply doesn't appear. This is
deliberate: the label is the primary artifact; narration is additive and its absence should never look
like an error state.

### 8.7 Known account-level failure mode

ElevenLabs API keys can carry a **per-key credit usage limit**, set independently of the account's
actual plan, under Profile → API Keys → (key) → usage limit. A key capped at 0 fails every request with
`quota_exceeded` / `"quota of 0"` regardless of how many real credits the account has — this was
diagnosed by testing the key directly against the REST endpoint and reading the exact error body, and
is a settings-page fix on elevenlabs.io, not a code issue.

---

## 9. Settings System (New in v2)

### 9.1 Context (`src/context/SettingsContext.jsx`, exact current file)

```javascript
import { createContext, useContext, useMemo } from 'react';
import { useLocalStorageState } from '../utils/useLocalStorageState';

const DEFAULT_SETTINGS = {
  narrationEnabled: true,
  volume: 0.45,
  voiceId: { wine: null, fire: null }, // null = use vessel default (Adam/Josh)
  motionIntensity: 'full', // 'full' | 'reduced'
  temperature: 1.1,
  tone: 'classy', // 'classy' | 'sassy'
  accentOverride: 'auto', // 'auto' | fire|earth|ocean|night|silver|forest|gold|rose
  aiArtEnabled: false, // requires a paid Gemini key — off by default on free tier
  ambientMuted: true, // browsers block autoplay anyway — starts on the first speaker-icon click
  ambientVolume: 0.6,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorageState('passion-uncorked:settings', DEFAULT_SETTINGS);

  const value = useMemo(() => ({
    settings: { ...DEFAULT_SETTINGS, ...settings },
    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
  }), [settings, setSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}

export { DEFAULT_SETTINGS };
```

Persisted under localStorage key `passion-uncorked:settings`, merged over defaults on read (so adding a
new setting later never breaks users with an older stored blob missing that key).

### 9.2 Every Setting, What It Controls, and Its Default

| Key | Type | Default | Effect |
|---|---|---|---|
| `narrationEnabled` | bool | `true` | Gates the ElevenLabs call entirely (saves quota if off) and the Replay button |
| `volume` | 0–1 | `0.45` | Playback volume for both autoplay and Replay |
| `voiceId.wine` / `voiceId.fire` | string \| null | `null` | Overrides the default Adam/Josh voice, populated from `fetchPremadeVoices()` |
| `motionIntensity` | `'full'` \| `'reduced'` | `'full'` | Sets `data-motion` on the app root; ORs with OS `prefers-reduced-motion` |
| `temperature` | 0.7–1.4 | `1.1` | Gemini generation temperature — creativity/randomness |
| `tone` | `'classy'` \| `'sassy'` | `'classy'` | Selects which system-instruction set Gemini uses (§7.2) |
| `accentOverride` | `'auto'` \| one of 8 moods | `'auto'` | Bypasses `labelData.color_mood` everywhere accent color is computed |
| `aiArtEnabled` | bool | `false` | Gates both `generateBackgroundArt` and `generateVesselPhoto` (§12) — off by default because the free tier cannot run them |
| `ambientMuted` | bool | `true` | Whether the ambient score is currently playing — see §13.4 for why it defaults muted |
| `ambientVolume` | 0–1 | `0.6` | Ambient score volume |

### 9.3 UI (`src/components/SettingsPanel.jsx`)

Built on the shared `Drawer` primitive (§14.2). Every control above gets its own row: on/off toggle
pairs for booleans, `<input type="range">` sliders for numeric settings, a `<select>` for accent
override and per-vessel voice. A "Reset to defaults" button at the bottom calls `resetSettings()`. The
AI-artwork row includes an inline note explaining the free-tier limitation directly in the UI, so the
user isn't left guessing why toggling it on doesn't visibly do anything without a paid key.

---

## 10. Tone: Classy vs. Sassy

Covered fully in §7.2 (the actual system instructions) — this section is the product rationale.
"Classy vs. Sassy" is the second thematic duality the app demonstrates, layered on top of Wine vs. Fire:
the same passion, in the same vessel, can be described with warm reverence or with affectionate,
stand-up-comedian-grade roasting. Both tones are held to the same JSON schema and the same field
constraints (word counts, quote formatting) — only the system instruction's persona changes, so the
label layout code (`Label.jsx`) needs zero awareness that tone exists at all.

---

## 11. VesselBottle.jsx — Complete Refined SVG (exact current file)

```jsx
// Derives a rough 0.6–1.3 flame-strength multiplier from the AI-written
// intensity line so the fire vessel's flame visibly reacts to the copy
// instead of always looking the same regardless of what was generated.
function deriveFlameStrength(intensityText = '') {
  const text = intensityText.toLowerCase();
  const HOT_WORDS = ['white-hot', 'blazing', 'scorching', 'inferno', 'molten', 'ablaze'];
  const COOL_WORDS = ['ember', 'smolder', 'low', 'quiet', 'faint'];
  if (HOT_WORDS.some((w) => text.includes(w))) return 1.25;
  if (COOL_WORDS.some((w) => text.includes(w))) return 0.75;
  return 1;
}

const EMBER_OFFSETS = [
  { left: 58, delay: 0, drift: 4, r: 2.2 },
  { left: 76, delay: 0.3, drift: -6, r: 1.6 },
  { left: 94, delay: 0.6, drift: 8, r: 2.4 },
  { left: 68, delay: 0.9, drift: -3, r: 1.4 },
  { left: 88, delay: 1.2, drift: 5, r: 1.8 },
  { left: 104, delay: 1.5, drift: -8, r: 1.5 },
];

const BUBBLE_OFFSETS = [
  { left: 45, delay: 0, duration: 3.6, r: 2.2 },
  { left: 70, delay: 1.1, duration: 4.2, r: 1.6 },
  { left: 95, delay: 0.5, duration: 3.8, r: 1.9 },
  { left: 115, delay: 1.8, duration: 4.6, r: 1.4 },
  { left: 58, delay: 2.4, duration: 4.0, r: 1.7 },
];

function VesselBottle({ vessel, accentColor = '#B87333', intensityText, reveal = true, reducedMotion = false }) {
  const isWine = vessel === 'wine';
  const flameStrength = deriveFlameStrength(intensityText);
  const revealClass = (base) => (reveal && !reducedMotion ? base : '');
  const loopClass = (base) => (!reducedMotion ? base : '');

  return (
    <svg width="180" height="500" viewBox="0 0 180 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {isWine ? (
        <g>
          <defs>
            <clipPath id="bottle-clip">
              <path d="M75,0 L105,0 L105,80 C105,110 140,120 140,160 L140,460 L20,460 L20,160
                       C20,120 75,110 75,80 Z" />
            </clipPath>
            <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0F2419" />
              <stop offset="45%" stopColor="#1C3A2B" />
              <stop offset="100%" stopColor="#15291D" />
            </linearGradient>
          </defs>

          {/* glass shell */}
          <path
            d="M75,0 L105,0 L105,80 C105,110 140,120 140,160 L140,460 L160,460 L150,470 L30,470
               L20,460 L20,160 C20,120 75,110 75,80 Z"
            fill="url(#glass-grad)"
          />

          <g clipPath="url(#bottle-clip)">
            {/* liquid fill, tinted by accent */}
            <rect
              x="20" y="146" width="120" height="320"
              fill={accentColor}
              opacity="0.55"
              className={revealClass('liquid-fill')}
            />
            {/* liquid surface meniscus — a soft highlighted line that gently breathes */}
            <ellipse cx="80" cy="146" rx="60" ry="4" fill={accentColor} opacity="0.85" className={loopClass('liquid-meniscus')} />

            {/* rising bubbles, contained within the glass */}
            {BUBBLE_OFFSETS.map((b, i) => (
              <circle
                key={i}
                cx={b.left}
                cy={440}
                r={b.r}
                fill="#FFF3D0"
                opacity="0.5"
                className={loopClass('wine-bubble')}
                style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
              />
            ))}
          </g>

          {/* glass highlight streak (static) */}
          <rect x="35" y="90" width="10" height="360" fill="#FFFFFF" opacity="0.08" />

          {/* animated shine sweep */}
          <g clipPath="url(#bottle-clip)">
            <rect x="0" y="0" width="30" height="500" fill="#FFFFFF" className={revealClass('glass-shine')} />
          </g>

          {/* foil capsule around the neck */}
          <rect x="72" y="32" width="36" height="22" fill="#C9A227" opacity="0.9" />
          <rect x="72" y="32" width="36" height="4" fill="#EBD98A" opacity="0.7" />
          <rect x="72" y="50" width="36" height="4" fill="#8B6914" opacity="0.5" />

          {/* cork, pops on reveal */}
          <g className={revealClass('cork-fly-reveal')}>
            <rect x="79" y="-16" width="22" height="18" rx="3" fill="#D9B382" />
            <ellipse cx="90" cy="-16" rx="11" ry="3" fill="#EAD3AE" />
            <rect x="79" y="-4" width="22" height="3" fill="#B98F5E" opacity="0.6" />
          </g>
        </g>
      ) : (
        <g>
          <defs>
            <radialGradient id="flame-outer-grad" cx="50%" cy="100%" r="90%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#FFE9B0" />
            </radialGradient>
            <linearGradient id="flame-inner-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFD9A0" />
              <stop offset="100%" stopColor="#FFF7E0" />
            </linearGradient>
            <filter id="glow-blur" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* anvil top plate */}
          <rect x="10" y="160" width="140" height="60" fill="#2A2622" />
          <path d="M150,180 L178,190 L178,205 L150,210 Z" fill="#2A2622" />
          <path d="M50,220 L110,220 L100,260 L60,260 Z" fill="#2A2622" />
          <rect x="30" y="260" width="100" height="200" fill="#2A2622" />
          <rect x="10" y="160" width="140" height="6" fill="#FF8A3D" opacity="0.12" />

          {/* hammer-strike flash + shockwave, centered over where the seal lands */}
          <circle cx="90" cy="190" r="26" fill="#FFF3E0" className={revealClass('hammer-flash')} />
          <circle cx="90" cy="190" r="20" fill="none" stroke={accentColor} strokeWidth="3" className={revealClass('shockwave-ring')} />

          {/* soft glow bloom behind the flame */}
          <ellipse cx="92" cy="130" rx="36" ry="48" fill={accentColor} opacity="0.4" filter="url(#glow-blur)" className={loopClass('flame-glow')} />

          {/* flame layer, strength-scaled, flickering */}
          <g style={{ transform: `scale(${flameStrength})`, transformOrigin: '90px 160px' }}>
            <path
              d="M75,160 C68,130 82,110 78,90 C90,105 96,125 90,140 C100,128 98,108 92,95
                 C108,112 106,140 96,155 C104,150 108,142 108,135 C112,150 106,162 92,163 Z"
              fill="url(#flame-outer-grad)"
              opacity="0.9"
              className={loopClass('flame-flicker')}
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M100,160 C96,142 104,128 100,112 C110,122 113,138 108,150 C114,144 115,134 111,126
                 C120,138 118,155 108,161 Z"
              fill="url(#flame-inner-grad)"
              opacity="0.9"
              className={loopClass('flame-flicker')}
              style={{ animationDelay: '0.4s' }}
            />
            <path
              d="M91,161 C88,146 93,134 90,122 C97,130 99,142 96,150 C100,146 101,140 99,135
                 C104,143 102,154 96,159 Z"
              fill="#FFFBEF"
              opacity="0.95"
              className={loopClass('flame-core')}
            />
          </g>

          {/* rising embers */}
          {EMBER_OFFSETS.map((e, i) => (
            <circle
              key={i}
              cx={e.left}
              cy={150}
              r={e.r}
              fill="#FFB347"
              className={loopClass('ember-spark')}
              style={{ '--spark-drift': `${e.drift}px`, animationDelay: `${e.delay}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

export default VesselBottle;
```

---

## 12. AI Artwork (New in v2 — gated, requires a paid Gemini key)

### 12.1 Two distinct outputs

`src/services/imagegen.js` produces **two** different images per generation, both calls run in
parallel with the ElevenLabs call (all non-blocking, `Promise.allSettled`):

1. **`generateBackgroundArt(passion, vessel, colorMood)`** — a low-contrast, textural background image
   (no text/letters requested) that sits behind the label's own SVG text, rendered at 35% opacity with
   `mix-blend-mode: multiply` so it never competes with legibility.
2. **`generateVesselPhoto(passion, vessel, info, colorMood)`** — a full photorealistic photograph of an
   actual bottle (wine) or a struck mark on an anvil (fire), with the passion's own generated title,
   subtitle, year, and closing note **explicitly requested to be legibly printed onto the label/tag
   within the image itself** — not just a generic themed photo, a real "label" baked into the picture.
   Rendered in place of the illustrated SVG silhouette on the result screen when available, with
   automatic fallback to the SVG if generation fails or is disabled.

Both use model `gemini-2.5-flash-image` with `responseModalities: ['IMAGE']`, and both return a
`data:` URL built from the response's `inlineData` (base64 + mimeType) — confirmed via the installed
SDK's type definitions (`GenerateContentConfig.responseModalities: Modality[]`) before ever writing
UI code around it.

### 12.2 Complete Service (`src/services/imagegen.js`, exact current file)

```javascript
import { GoogleGenAI } from '@google/genai';

const STYLE_BRIEF = {
  wine: 'a dusty amber 1920s wine cellar archive: aged parchment texture, copper foil, ' +
    'candlelight, hand-pressed paper grain',
  fire: 'a mythic smithy forge-mark register: charcoal dark, ember glow, hard iron edges, ' +
    'scorched metal texture',
};

// Requires a paid Gemini key — the free tier has zero quota for every image-capable
// model (verified directly against the API: 429 RESOURCE_EXHAUSTED, limit 0). Gated
// behind settings.aiArtEnabled, off by default, so this never silently burns a real
// user's request budget on something that structurally cannot succeed for them.
export async function generateBackgroundArt(passion, vessel, colorMood) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

  const prompt = `Create a small square background texture illustration for a ${STYLE_BRIEF[vessel]},
themed around the passion "${passion}", with a subtle ${colorMood || 'neutral'} color accent.
No text, no words, no letters, no numbers anywhere in the image. Abstract/textural only —
this sits behind label text, so keep it low-contrast and non-distracting.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: {
      responseModalities: ['IMAGE'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);
  if (!imagePart) throw new Error('No image returned from Gemini');

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

const VESSEL_PHOTO_BRIEF = {
  wine: (passion, info, colorMood) => `A cinematic, photorealistic still-life photograph of a single
vintage wine bottle standing in a dim 1920s stone cellar, resting on aged wood. The bottle carries a
real paper label — legibly print the following text directly onto that label, in elegant serif type,
laid out like an actual wine label (title largest, subtitle beneath, year and note smaller at the
bottom):
"${info.title}"
"${info.subtitle}"
"${info.year}"
"${info.note}"
Warm candlelight and dust motes drift through the air, deep shadows, shallow depth of field. The wine
visible through the glass glows faintly with a ${colorMood || 'amber'} tint, evoking the passion for
"${passion}". Moody, painterly, editorial product photography — no other objects, no people, no text
anywhere in the frame except on that label.`,
  fire: (passion, info, colorMood) => `A cinematic, photorealistic photograph of a blacksmith's forge
at night: a freshly struck iron mark or blade lies on a soot-blackened anvil, still glowing hot along
its edge in a ${colorMood || 'ember-orange'} hue, faint smoke curling upward. Beside it, a small
stamped metal tag or brand plate legibly reads the following, engraved/stamped like real foundry
markings (title largest, subtitle beneath, year and note smaller):
"${info.title}"
"${info.subtitle}"
"${info.year}"
"${info.note}"
Sparks drift in the dark smithy air, lit only by the forge's glow, evoking the passion for
"${passion}". Dramatic, high-contrast, editorial product photography — no people, no text anywhere
in the frame except on that tag.`,
};

// Same free-tier limitation as generateBackgroundArt — gated behind
// settings.aiArtEnabled. Produces a full vessel "portrait" (an actual bottle
// or forge-mark photograph, with the passion's generated title/note legibly
// rendered on the label) rather than just a label background texture.
export async function generateVesselPhoto(passion, vessel, info, colorMood) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const prompt = VESSEL_PHOTO_BRIEF[vessel](passion, info, colorMood);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: {
      responseModalities: ['IMAGE'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);
  if (!imagePart) throw new Error('No image returned from Gemini');

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}
```

`info` is built in `App.jsx` at call time, generically from the vessel's field map (so no per-vessel
branching lives in `imagegen.js` itself):

```javascript
const f = VESSELS[chosenVessel].fields;
const info = {
  title: label[f.title],
  subtitle: label[f.subtitle],
  year: `${f.yearPrefix} · ${label[f.year]}`,
  note: label[f.closer],
};
```

### 12.3 The free-tier wall (confirmed, not assumed)

Tested directly against the account's key, across **every** image-capable model available to it
(`gemini-2.5-flash-image`, `gemini-3-pro-image`, `gemini-3.1-flash-image`,
`gemini-3.1-flash-lite-image`): all four return `429 RESOURCE_EXHAUSTED` with the quota violation
explicitly reporting **`limit: 0`** — not a rate limit that recovers, a hard zero allocation for the
free tier. This is why `aiArtEnabled` defaults to `false`: turning it on for a free-tier user produces
nothing but console warnings and silent fallback to the procedural texture / illustrated SVG, which
would look like the feature is broken rather than gated. The Settings UI carries an explicit note
saying so.

---

## 13. Ambient Music (New in v2 — original composition, zero dependencies)

### 13.1 Why synthesized, not audio files

The product needed "real music, not ambient noise" without shipping licensed or third-party audio
assets and without adding an audio-file pipeline. The solution actually composes two short original
musical loops — real notes, real chord progressions, real timing — using nothing but the Web Audio
API's native oscillator/gain/filter nodes. No npm dependency, no binary assets, no licensing surface at
all.

### 13.2 The two themes

- **Wine** — an 8-second loop: a gentle triangle-wave arpeggio over a Cmaj7 → Am7 → Fmaj7 → G7
  progression (a generic, widely-used jazz-lounge progression), plus a soft sine-wave bass note
  sustained under each chord.
- **Fire** — a 4-second loop: a driving sawtooth-wave bass ostinato in E minor (E2/E3/B2 pulse,
  eighth-note pacing) plus two filtered-noise "hammer-strike" percussive accents per loop.

### 13.3 Synthesis technique

Each note is played via `playNote()` — an `OscillatorNode` (triangle for wine's melody, sine for its
bass, sawtooth for fire's bass) routed through a per-note `GainNode` envelope (a fast linear attack,
then an exponential decay to near-silence) so notes don't click or hang. Fire's percussive accents use
`playAccent()` — a short burst of decaying white noise through a highpass filter, for a metallic
"clang" rather than a tonal note. Both themes route through their own low-pass-filtered bus before the
shared master gain, giving wine a warmer/darker tone color than fire's slightly brighter one.

**Seamless looping** is handled by `scheduleLoop()` — rather than trying to loop a rendered audio
buffer, it re-invokes the note-building function once per loop duration, always scheduling the *next*
iteration ahead of when it's needed (via `setTimeout` keyed off `AudioContext.currentTime`, not naive
JS-timer timing), and returns a `stop()` that immediately halts every currently-scheduled oscillator —
including ones scheduled for the future — so muting is instant, not "finishes the current loop first."

**Crossfading** between themes (`startAmbient`) fades the outgoing theme's gain down over 0.4s while
ramping the incoming theme's gain up over 1.0s, rather than a hard cut — both themes briefly overlap.

### 13.4 Why it defaults muted, and the gain-staging lesson learned

Browsers block audio autoplay until a genuine user gesture occurs — there is no way around this, so
`ambientMuted: true` by default is not a stylistic choice, it's a platform constraint; the NavBar's
speaker icon click **is** that gesture.

A real bug was caught and fixed during development: an earlier version of this feature computed final
loudness as `noteGain × masterGain`, and with the initial default `ambientVolume: 0.18`, the resulting
peak amplitude worked out to roughly 0.04 on a −1..1 scale — inaudible on most systems, which is exactly
why an earlier pass at this feature was reported as "not sounding." This was diagnosed by rendering the
exact same synthesis code through an `OfflineAudioContext` (a pure-math renderer, no real audio device
needed) and measuring the actual peak/RMS of the output buffer — not just checking for the absence of
console errors, which had been the previous (insufficient) verification method. The default
`ambientVolume` was raised to `0.6`, which renders a peak of **0.131** — clearly audible, no clipping —
confirmed the same way. **Lesson for any future audio feature in this app: verify loudness by rendering
and measuring the waveform, not by checking that the code runs without throwing.**

### 13.5 Complete Service (`src/services/ambientSound.js`, exact current file)

```javascript
// Original looping musical themes, synthesized note-by-note via the Web Audio
// API — no audio files, no dependencies. Wine gets a slow, warm jazzy
// arpeggio (Cmaj7 - Am7 - Fmaj7 - G7); fire gets a driving minor-key bass
// ostinato with hammer-strike accents.

const A4 = 440;
const freq = (semitonesFromA4) => A4 * Math.pow(2, semitonesFromA4 / 12);

const NOTE = {
  C2: freq(-33), E2: freq(-29), F2: freq(-28), G2: freq(-26), A2: freq(-24), B2: freq(-22),
  C3: freq(-21), D3: freq(-19), E3: freq(-17), F3: freq(-16), G3: freq(-14), A3: freq(-12), B3: freq(-10),
  C4: freq(-9), D4: freq(-7), E4: freq(-5), F4: freq(-4), G4: freq(-2), A4: freq(0), B4: freq(2),
  C5: freq(3),
};

// { t: offset in seconds from loop start, freq, dur: note length, gain }
const WINE_LOOP_DURATION = 8;
const WINE_MELODY = [
  // Cmaj7 arpeggio
  { t: 0.0, freq: NOTE.C4, dur: 1.1, gain: 0.22 },
  { t: 0.5, freq: NOTE.E4, dur: 1.1, gain: 0.18 },
  { t: 1.0, freq: NOTE.G4, dur: 1.1, gain: 0.16 },
  { t: 1.5, freq: NOTE.B4, dur: 1.1, gain: 0.14 },
  // Am7 arpeggio
  { t: 2.0, freq: NOTE.A3, dur: 1.1, gain: 0.22 },
  { t: 2.5, freq: NOTE.C4, dur: 1.1, gain: 0.18 },
  { t: 3.0, freq: NOTE.E4, dur: 1.1, gain: 0.16 },
  { t: 3.5, freq: NOTE.G4, dur: 1.1, gain: 0.14 },
  // Fmaj7 arpeggio
  { t: 4.0, freq: NOTE.F3, dur: 1.1, gain: 0.22 },
  { t: 4.5, freq: NOTE.A3, dur: 1.1, gain: 0.18 },
  { t: 5.0, freq: NOTE.C4, dur: 1.1, gain: 0.16 },
  { t: 5.5, freq: NOTE.E4, dur: 1.1, gain: 0.14 },
  // G7 arpeggio
  { t: 6.0, freq: NOTE.G3, dur: 1.1, gain: 0.22 },
  { t: 6.5, freq: NOTE.B3, dur: 1.1, gain: 0.18 },
  { t: 7.0, freq: NOTE.D4, dur: 1.1, gain: 0.16 },
  { t: 7.5, freq: NOTE.F4, dur: 1.1, gain: 0.14 },
];
const WINE_BASS = [
  { t: 0, freq: NOTE.C3, dur: 2.0, gain: 0.18 },
  { t: 2, freq: NOTE.A2, dur: 2.0, gain: 0.18 },
  { t: 4, freq: NOTE.F2, dur: 2.0, gain: 0.18 },
  { t: 6, freq: NOTE.G2, dur: 2.0, gain: 0.18 },
];

const FIRE_LOOP_DURATION = 4;
const FIRE_BASS = [
  { t: 0.0, freq: NOTE.E2, dur: 0.35, gain: 0.3 },
  { t: 0.5, freq: NOTE.E3, dur: 0.35, gain: 0.22 },
  { t: 1.0, freq: NOTE.B2, dur: 0.35, gain: 0.26 },
  { t: 1.5, freq: NOTE.E3, dur: 0.35, gain: 0.22 },
  { t: 2.0, freq: NOTE.E2, dur: 0.35, gain: 0.3 },
  { t: 2.5, freq: NOTE.E3, dur: 0.35, gain: 0.22 },
  { t: 3.0, freq: NOTE.D3, dur: 0.35, gain: 0.26 },
  { t: 3.5, freq: NOTE.E3, dur: 0.35, gain: 0.22 },
];
const FIRE_ACCENTS = [
  { t: 0.0, gain: 0.35 },
  { t: 2.0, gain: 0.35 },
];

function playNote(ctx, bus, { freq: f, dur, gain }, startTime, waveform) {
  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = f;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(gain, startTime + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  osc.connect(env);
  env.connect(bus);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
  return osc;
}

// A short filtered-noise "clang" for the fire theme's hammer-strike accents.
function playAccent(ctx, bus, { gain }, startTime) {
  const size = Math.floor(ctx.sampleRate * 0.15);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1200;
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, startTime);
  env.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

  source.connect(filter);
  filter.connect(env);
  env.connect(bus);
  source.start(startTime);
  return source;
}

function buildWineTheme(ctx, masterGain) {
  const bus = ctx.createGain();
  bus.gain.value = 1;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2200;
  bus.connect(filter);
  filter.connect(masterGain);

  return scheduleLoop(ctx, WINE_LOOP_DURATION, (loopStart) => {
    const nodes = [];
    for (const note of WINE_MELODY) nodes.push(playNote(ctx, bus, note, loopStart + note.t, 'triangle'));
    for (const note of WINE_BASS) nodes.push(playNote(ctx, bus, note, loopStart + note.t, 'sine'));
    return nodes;
  });
}

function buildFireTheme(ctx, masterGain) {
  const bus = ctx.createGain();
  bus.gain.value = 1;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3200;
  bus.connect(filter);
  filter.connect(masterGain);

  return scheduleLoop(ctx, FIRE_LOOP_DURATION, (loopStart) => {
    const nodes = [];
    for (const note of FIRE_BASS) nodes.push(playNote(ctx, bus, note, loopStart + note.t, 'sawtooth'));
    for (const accent of FIRE_ACCENTS) nodes.push(playAccent(ctx, bus, accent, loopStart + accent.t));
    return nodes;
  });
}

// Schedules `build(loopStartTime)` once per loop iteration, always keeping
// one iteration scheduled ahead of playback so there's no audible gap.
// Returns a stop() that halts everything — including already-scheduled but
// not-yet-started future notes — immediately.
function scheduleLoop(ctx, loopDuration, build) {
  let allNodes = [];
  let stopped = false;

  function scheduleNext(loopStart) {
    if (stopped) return;
    allNodes.push(...build(loopStart));
    const msUntilNext = (loopStart + loopDuration - ctx.currentTime) * 1000;
    setTimeout(() => scheduleNext(loopStart + loopDuration), Math.max(msUntilNext, 0));
  }

  scheduleNext(ctx.currentTime + 0.05);

  return () => {
    stopped = true;
    for (const node of allNodes) {
      try { node.stop(); } catch { /* already stopped */ }
    }
  };
}

let audioCtx = null;
let current = null; // { vessel, stop(), setVolume(v) }

function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Starting a new theme fades the previous one out while fading the new one
// in — an overlap crossfade rather than a hard cut.
export function startAmbient(vessel, volume = 0.35) {
  const ctx = getContext();
  const previous = current;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);
  masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.0);

  const stopFn = vessel === 'fire' ? buildFireTheme(ctx, masterGain) : buildWineTheme(ctx, masterGain);

  current = {
    vessel,
    stop: () => {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      setTimeout(() => {
        try { stopFn(); masterGain.disconnect(); } catch { /* already stopped */ }
      }, 450);
    },
    setVolume: (v) => masterGain.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.3),
  };

  if (previous) previous.stop();
}

export function stopAmbient() {
  if (current) {
    current.stop();
    current = null;
  }
}

export function setAmbientVolume(v) {
  current?.setVolume(v);
}

export function getCurrentAmbientVessel() {
  return current?.vessel ?? null;
}
```

### 13.6 Wiring into the app

`App.jsx` watches the "active vessel" (submitted vessel, or the hover-preview vessel on the landing
screen, defaulting to `'wine'`) and — only when `!settings.ambientMuted` — crossfades to match whenever
it changes, via a `useEffect` keyed on `[activeVessel, settings.ambientMuted, settings.ambientVolume]`. A
second effect pushes live volume changes through `setAmbientVolume()` while a theme is already playing,
so the Settings slider updates in real time without restarting the loop.

---

## 14. Navigation + Gallery (New in v2)

### 14.1 NavBar.jsx (exact current file)

```jsx
import { VESSELS } from '../config/vessels';
import { useSettings } from '../context/SettingsContext';
import { startAmbient, stopAmbient } from '../services/ambientSound';

function NavBar({ vessel, onReset, onOpenSettings, onOpenGallery, galleryCount }) {
  const { settings, updateSettings } = useSettings();
  const v = vessel ? VESSELS[vessel] : null;
  const textColor = v ? v.parchment : '#F2E8D5';
  const accent = v ? v.accentUi : '#B87333';
  const bg = v ? `${v.bg}CC` : 'rgba(26, 18, 9, 0.8)';

  function toggleAmbient() {
    const nextMuted = !settings.ambientMuted;
    updateSettings({ ambientMuted: nextMuted });
    if (nextMuted) {
      stopAmbient();
    } else {
      startAmbient(vessel || 'wine', settings.ambientVolume);
    }
  }

  const iconButtonStyle = {
    background: 'transparent',
    border: `1px solid ${accent}55`,
    color: textColor,
    width: 36,
    height: 36,
    borderRadius: 0,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: bg,
        backdropFilter: 'blur(6px)',
        borderBottom: `1px solid ${accent}33`,
        transition: 'background 0.4s ease',
      }}
    >
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset and return to landing"
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          fontFamily: "'Cormorant Garamond'",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span aria-hidden="true">🍷🔥</span>
        Passion Uncorked
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={toggleAmbient}
          aria-label={settings.ambientMuted ? 'Enable ambient sound' : 'Mute ambient sound'}
          aria-pressed={!settings.ambientMuted}
          style={iconButtonStyle}
        >
          {settings.ambientMuted ? '🔇' : '🔊'}
        </button>
        <button type="button" onClick={onOpenGallery} aria-label="Open gallery" style={iconButtonStyle}>
          🖼
          {galleryCount > 0 && (
            <span
              style={{
                position: 'absolute', top: -6, right: -6,
                background: accent, color: v ? v.bg : '#1A1209',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Inter',
              }}
            >
              {galleryCount > 9 ? '9+' : galleryCount}
            </span>
          )}
        </button>
        <button type="button" onClick={onOpenSettings} aria-label="Open settings" style={iconButtonStyle}>
          ⚙
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
```

### 14.2 Drawer.jsx — shared primitive (exact current file)

Both Settings and Gallery are built on one shared slide-in panel: backdrop click to close, `Escape`
key to close, `role="dialog"` + `aria-modal` + focus on open.

```jsx
import { useEffect, useRef } from 'react';

function Drawer({ open, onClose, title, accentColor, bg, textColor, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="drawer-panel"
        style={{
          position: 'relative',
          width: 'min(360px, 92vw)',
          height: '100%',
          background: bg,
          color: textColor,
          borderLeft: `1px solid ${accentColor}55`,
          padding: '20px 20px 32px',
          overflowY: 'auto',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond'", fontStyle: 'italic', fontSize: 22, margin: 0, color: textColor }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent', border: `1px solid ${accentColor}66`, color: textColor,
              width: 30, height: 30, fontSize: 16, borderRadius: 0, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Drawer;
```

### 14.3 GalleryPanel.jsx — local history (exact current file)

Every successful generation is appended to a localStorage array (key `passion-uncorked:gallery`),
capped at 20 entries (oldest dropped), via `useLocalStorageState` — no server, no account, no sync.
Selecting an entry jumps straight to the result screen with the cached `labelData` — **zero new API
calls** — audio/AI-art are not cached (would bloat localStorage with base64 blobs) so revisiting shows
the label without narration/photo, which is an acceptable and clearly-understood tradeoff for a free
re-view.

```jsx
import Drawer from './Drawer';
import { VESSELS } from '../config/vessels';

function GalleryPanel({ open, onClose, vessel, entries, onSelect, onDelete, onClearAll }) {
  const v = VESSELS[vessel || 'wine'];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Gallery (${entries.length})`}
      accentColor={v.accentUi}
      bg={v.bg}
      textColor={v.parchment}
    >
      {entries.length === 0 ? (
        <p style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', opacity: 0.6 }}>
          Nothing here yet — generated labels are saved automatically.
        </p>
      ) : (
        <>
          {entries.map((entry) => {
            const ev = VESSELS[entry.vessel];
            const f = ev.fields;
            const title = entry.labelData[f.title];
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: `1px solid ${entry.accentColor}55`,
                  padding: '8px 10px', marginBottom: 8, cursor: 'pointer',
                }}
                onClick={() => onSelect(entry)}
              >
                <span style={{ fontSize: 18 }}>{ev.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond'", fontStyle: 'italic', fontSize: 14,
                    color: entry.accentColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {title}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, opacity: 0.5 }}>{entry.passion}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                  aria-label={`Delete ${title}`}
                  style={{
                    background: 'transparent', border: 'none', color: v.parchment, opacity: 0.5,
                    fontSize: 14, padding: 4,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onClearAll}
            style={{
              width: '100%', marginTop: 8, padding: '8px', fontFamily: 'Inter', fontSize: 12,
              background: 'transparent', color: v.parchment, opacity: 0.6,
              border: `1px solid ${v.accentUi}33`,
            }}
          >
            Clear all
          </button>
        </>
      )}
    </Drawer>
  );
}

export default GalleryPanel;
```

### 14.4 SettingsPanel.jsx (exact current file)

```jsx
import { useEffect, useState } from 'react';
import Drawer from './Drawer';
import { useSettings } from '../context/SettingsContext';
import { VESSELS } from '../config/vessels';
import { fetchPremadeVoices, DEFAULT_VOICE_IDS } from '../services/elevenlabs';
import { startAmbient, stopAmbient } from '../services/ambientSound';

const MOODS = ['fire', 'earth', 'ocean', 'night', 'silver', 'forest', 'gold', 'rose'];

function Row({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleButtons({ options, value, onChange, accent, textColor }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontFamily: 'Inter',
            fontSize: 12,
            border: `1px solid ${value === opt.value ? accent : `${accent}55`}`,
            background: value === opt.value ? accent : 'transparent',
            color: value === opt.value ? '#1A1209' : textColor,
            borderRadius: 0,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPanel({ open, onClose, vessel }) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const v = VESSELS[vessel || 'wine'];
  const [voices, setVoices] = useState(null);
  const [voiceError, setVoiceError] = useState(false);

  useEffect(() => {
    if (!open || voices || voiceError) return;
    fetchPremadeVoices()
      .then(setVoices)
      .catch(() => setVoiceError(true));
  }, [open, voices, voiceError]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Settings"
      accentColor={v.accentUi}
      bg={v.bg}
      textColor={v.parchment}
    >
      <Row label="Narration">
        <ToggleButtons
          accent={v.accentUi}
          textColor={v.parchment}
          value={settings.narrationEnabled ? 'on' : 'off'}
          onChange={(val) => updateSettings({ narrationEnabled: val === 'on' })}
          options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
        />
      </Row>

      <Row label={`Volume — ${Math.round(settings.volume * 100)}%`}>
        <input
          type="range" min="0" max="1" step="0.05"
          value={settings.volume}
          onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
          style={{ width: '100%' }}
        />
      </Row>

      {(['wine', 'fire']).map((ves) => (
        <Row key={ves} label={`${ves === 'wine' ? '🍷 Wine' : '🔥 Fire'} narrator`}>
          <select
            value={settings.voiceId[ves] || ''}
            onChange={(e) => updateSettings({ voiceId: { ...settings.voiceId, [ves]: e.target.value || null } })}
            style={{
              width: '100%', padding: '8px', fontFamily: 'Inter', fontSize: 12,
              background: 'transparent', color: v.parchment, border: `1px solid ${v.accentUi}55`,
            }}
          >
            <option value="" style={{ color: '#000' }}>Default ({ves === 'wine' ? 'Adam' : 'Josh'})</option>
            {voices?.map((voice) => (
              <option key={voice.voiceId} value={voice.voiceId} style={{ color: '#000' }}>
                {voice.name}
              </option>
            ))}
          </select>
          {voiceError && (
            <p style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>Couldn't load voice list — using defaults.</p>
          )}
        </Row>
      ))}

      <Row label="Ambient sound">
        <ToggleButtons
          accent={v.accentUi}
          textColor={v.parchment}
          value={settings.ambientMuted ? 'off' : 'on'}
          onChange={(val) => {
            const muted = val === 'off';
            updateSettings({ ambientMuted: muted });
            if (muted) stopAmbient();
            else startAmbient(vessel || 'wine', settings.ambientVolume);
          }}
          options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]}
        />
      </Row>

      <Row label={`Ambient volume — ${Math.round(settings.ambientVolume * 100)}%`}>
        <input
          type="range" min="0" max="1" step="0.02"
          value={settings.ambientVolume}
          onChange={(e) => updateSettings({ ambientVolume: parseFloat(e.target.value) })}
          style={{ width: '100%' }}
        />
      </Row>

      <Row label="Motion">
        <ToggleButtons
          accent={v.accentUi}
          textColor={v.parchment}
          value={settings.motionIntensity}
          onChange={(val) => updateSettings({ motionIntensity: val })}
          options={[{ value: 'full', label: 'Full' }, { value: 'reduced', label: 'Reduced' }]}
        />
      </Row>

      <Row label="Tone">
        <ToggleButtons
          accent={v.accentUi}
          textColor={v.parchment}
          value={settings.tone}
          onChange={(val) => updateSettings({ tone: val })}
          options={[{ value: 'classy', label: 'Classy' }, { value: 'sassy', label: 'Sassy 🔥' }]}
        />
      </Row>

      <Row label={`Creativity — ${settings.temperature.toFixed(2)}`}>
        <input
          type="range" min="0.7" max="1.4" step="0.05"
          value={settings.temperature}
          onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
          style={{ width: '100%' }}
        />
      </Row>

      <Row label="Accent color">
        <select
          value={settings.accentOverride}
          onChange={(e) => updateSettings({ accentOverride: e.target.value })}
          style={{
            width: '100%', padding: '8px', fontFamily: 'Inter', fontSize: 12,
            background: 'transparent', color: v.parchment, border: `1px solid ${v.accentUi}55`,
          }}
        >
          <option value="auto" style={{ color: '#000' }}>Auto (from AI)</option>
          {MOODS.map((m) => (
            <option key={m} value={m} style={{ color: '#000' }}>{m}</option>
          ))}
        </select>
      </Row>

      <Row label="AI artwork (label background + vessel photo)">
        <ToggleButtons
          accent={v.accentUi}
          textColor={v.parchment}
          value={settings.aiArtEnabled ? 'on' : 'off'}
          onChange={(val) => updateSettings({ aiArtEnabled: val === 'on' })}
          options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]}
        />
        <p style={{ fontSize: 10, opacity: 0.5, marginTop: 6 }}>
          Requires a paid Gemini API key — the free tier grants zero image-generation quota.
          Generates a real photograph of the bottle/forge mark plus a label background texture;
          falls back to the illustrated silhouette and standard texture if generation fails.
        </p>
      </Row>

      <button
        type="button"
        onClick={resetSettings}
        style={{
          width: '100%', marginTop: 8, padding: '8px', fontFamily: 'Inter', fontSize: 12,
          background: 'transparent', color: v.parchment, opacity: 0.6,
          border: `1px solid ${v.accentUi}33`,
        }}
      >
        Reset to defaults
      </button>
    </Drawer>
  );
}

export default SettingsPanel;
```

---

## 15. Share Utility (`src/utils/share.js`, exact current file — unchanged since v1)

```javascript
import { VESSELS } from '../config/vessels';

export function buildTwitterShareUrl(passion, vessel, labelData, appUrl) {
  const v = VESSELS[vessel];
  const f = v.fields;
  const title = labelData[f.title];
  const year = labelData[f.year];
  const closer = labelData[f.closer].replace(/"/g, '');

  const text = encodeURIComponent(
    `I just ${v.verb} my passion for ${passion} ${v.emoji}\n\n` +
    `${title} · ${year}\n"${closer}"\n\n` +
    `Get yours →`
  );
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(appUrl)}`;
}
```

---

## 16. State Machine and Every Component (Complete, Exact, Current)

### 16.1 App.jsx — root state machine

```jsx
import { useEffect, useState } from 'react';
import LandingScreen from './components/LandingScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import NavBar from './components/NavBar';
import SettingsPanel from './components/SettingsPanel';
import GalleryPanel from './components/GalleryPanel';
import { generateLabelData } from './services/gemini';
import { generateVoiceAudio } from './services/elevenlabs';
import { generateBackgroundArt, generateVesselPhoto } from './services/imagegen';
import { getAccentColor } from './utils/colorMood';
import { VESSELS } from './config/vessels';
import { useSettings } from './context/SettingsContext';
import { useLocalStorageState } from './utils/useLocalStorageState';
import { startAmbient, setAmbientVolume, getCurrentAmbientVessel } from './services/ambientSound';

const GALLERY_CAP = 20;

function classifyError(err) {
  const msg = err.message || '';
  if (msg.includes('API_KEY') || msg.includes('401')) return 'API key invalid. Check your .env file.';
  if (msg.includes('429') || msg.includes('quota')) return 'The cellar is overwhelmed. Try again in a moment.';
  return 'Something went wrong. Try again.';
}

function App() {
  const { settings } = useSettings();
  const [gallery, setGallery] = useLocalStorageState('passion-uncorked:gallery', []);

  const [phase, setPhase] = useState('landing'); // 'landing'|'loading'|'result'
  const [vessel, setVessel] = useState(null); // 'wine'|'fire'
  const [previewVessel, setPreviewVessel] = useState(null);
  const [passion, setPassion] = useState('');
  const [labelData, setLabelData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [vesselPhoto, setVesselPhoto] = useState(null);
  const [error, setError] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const reducedMotion = settings.motionIntensity === 'reduced';
  const activeVessel = vessel || previewVessel || 'wine';

  // Crossfade the ambient loop whenever the active vessel changes (vessel
  // pick, hover preview, submit) — only once the user has unmuted, since
  // browsers block audio until a real gesture has happened (the speaker
  // button click in NavBar is that gesture).
  useEffect(() => {
    if (settings.ambientMuted) return;
    if (getCurrentAmbientVessel() === activeVessel) return;
    startAmbient(activeVessel, settings.ambientVolume);
  }, [activeVessel, settings.ambientMuted, settings.ambientVolume]);

  useEffect(() => {
    if (!settings.ambientMuted) setAmbientVolume(settings.ambientVolume);
  }, [settings.ambientVolume, settings.ambientMuted]);

  function addToGallery(entry) {
    setGallery((prev) => [entry, ...prev].slice(0, GALLERY_CAP));
  }

  async function handleSubmit(inputPassion, chosenVessel) {
    const trimmed = (inputPassion || passion).trim();
    if (!trimmed || trimmed.length < 2 || !chosenVessel) return;

    setPassion(trimmed);
    setVessel(chosenVessel);
    setPhase('loading');
    setError(null);
    setAudioUrl(null);
    setBackgroundImage(null);
    setVesselPhoto(null);

    try {
      const label = await generateLabelData(trimmed, chosenVessel, {
        temperature: settings.temperature,
        tone: settings.tone,
      });
      setLabelData(label);

      const sideEffects = [];

      if (settings.narrationEnabled) {
        sideEffects.push(
          generateVoiceAudio(label.tts_script, chosenVessel, settings.voiceId[chosenVessel])
            .then(setAudioUrl)
            .catch((audioErr) => console.warn('Narration failed, showing label without audio:', audioErr))
        );
      }

      if (settings.aiArtEnabled) {
        const f = VESSELS[chosenVessel].fields;
        const info = {
          title: label[f.title],
          subtitle: label[f.subtitle],
          year: `${f.yearPrefix} · ${label[f.year]}`,
          note: label[f.closer],
        };
        sideEffects.push(
          generateBackgroundArt(trimmed, chosenVessel, label.color_mood)
            .then(setBackgroundImage)
            .catch((artErr) => console.warn('AI background art failed, using procedural texture:', artErr))
        );
        sideEffects.push(
          generateVesselPhoto(trimmed, chosenVessel, info, label.color_mood)
            .then(setVesselPhoto)
            .catch((photoErr) => console.warn('AI vessel photo failed, using illustrated silhouette:', photoErr))
        );
      }

      await Promise.allSettled(sideEffects);

      const accentColor = getAccentColor(
        chosenVessel,
        settings.accentOverride !== 'auto' ? settings.accentOverride : label.color_mood
      );
      addToGallery({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        passion: trimmed,
        vessel: chosenVessel,
        labelData: label,
        accentColor,
        timestamp: Date.now(),
      });

      setPhase('result');
    } catch (err) {
      console.error(err);
      setError(classifyError(err));
      setPhase('landing');
    }
  }

  function handleReset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setPhase('landing');
    setPassion('');
    setVessel(null);
    setPreviewVessel(null);
    setLabelData(null);
    setAudioUrl(null);
    setBackgroundImage(null);
    setVesselPhoto(null);
    setError(null);
  }

  function handleGallerySelect(entry) {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setPassion(entry.passion);
    setVessel(entry.vessel);
    setLabelData(entry.labelData);
    setAudioUrl(null);
    setBackgroundImage(null);
    setVesselPhoto(null);
    setError(null);
    setPhase('result');
    setGalleryOpen(false);
  }

  function handleGalleryDelete(id) {
    setGallery((prev) => prev.filter((e) => e.id !== id));
  }

  function handleGalleryClearAll() {
    setGallery([]);
  }

  let content;
  if (phase === 'loading') {
    content = <LoadingScreen vessel={vessel} aiArtEnabled={settings.aiArtEnabled} reducedMotion={reducedMotion} />;
  } else if (phase === 'result') {
    content = (
      <ResultScreen
        vessel={vessel}
        passion={passion}
        labelData={labelData}
        audioUrl={audioUrl}
        backgroundImage={backgroundImage}
        vesselPhoto={vesselPhoto}
        accentOverride={settings.accentOverride}
        volume={settings.volume}
        narrationEnabled={settings.narrationEnabled}
        reducedMotion={reducedMotion}
        onReset={handleReset}
      />
    );
  } else {
    content = (
      <LandingScreen
        onSubmit={handleSubmit}
        error={error}
        previewVessel={previewVessel}
        setPreviewVessel={setPreviewVessel}
      />
    );
  }

  return (
    <div data-motion={reducedMotion ? 'reduced' : 'full'}>
      <NavBar
        vessel={vessel || previewVessel}
        onReset={handleReset}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenGallery={() => setGalleryOpen(true)}
        galleryCount={gallery.length}
      />

      <div style={{ paddingTop: 56 }}>
        <div key={phase} className={reducedMotion ? '' : 'phase-fade'}>
          {content}
        </div>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} vessel={vessel || previewVessel} />
      <GalleryPanel
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        vessel={vessel || previewVessel}
        entries={gallery}
        onSelect={handleGallerySelect}
        onDelete={handleGalleryDelete}
        onClearAll={handleGalleryClearAll}
      />
    </div>
  );
}

export default App;
```

### 16.2 main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);
```

### 16.3 config/vessels.js

```javascript
export const VESSELS = {
  wine: {
    key: 'wine',
    label: '🍷 Age it in wine',
    bg: '#1A1209',
    parchment: '#F2E8D5',
    primary: '#6B1A2A',
    accentUi: '#B87333',
    ink: '#2C1810',
    vesselBody: '#1C3A2B',
    gold: '#D4AF37',
    titleFont: "'Cormorant Garamond'",
    verb: 'uncorked',
    emoji: '🍷',
    fields: {
      title: 'chateau', subtitle: 'domain', year: 'vintage', body: 'tasting_notes',
      tag: 'rarity', extra: 'pairing', closer: 'collectors_note',
      labels: { body: 'TASTING NOTES', tag: 'RARITY', extra: 'PAIRS WITH', closer: "COLLECTOR'S NOTE" },
      yearPrefix: 'VINTAGE',
    },
    loadingCopy: [
      'Selecting your terroir…',
      'Ageing your passion underground…',
      'Consulting the Grand Cru committee…',
      'Applying the wax seal…',
    ],
  },
  fire: {
    key: 'fire',
    label: '🔥 Forge it',
    bg: '#1A1512',
    parchment: '#C9BFB5',
    primary: '#E8531C',
    accentUi: '#FF8A3D',
    ink: '#3D3835',
    vesselBody: '#2A2622',
    gold: '#FF8A3D',
    titleFont: "'Cinzel'",
    verb: 'forged',
    emoji: '🔥',
    fields: {
      title: 'forge_name', subtitle: 'smith_title', year: 'year_forged', body: 'temper_notes',
      tag: 'intensity', extra: 'tempered_with', closer: 'smiths_mark',
      labels: { body: 'TEMPER NOTES', tag: 'INTENSITY', extra: 'TEMPERED WITH', closer: "SMITH'S MARK" },
      yearPrefix: 'FORGED',
    },
    loadingCopy: [
      'Stoking the forge…',
      'Tempering your passion in the coals…',
      'Consulting the Order of the Anvil…',
      'Striking the mark…',
    ],
  },
};

export const PASSION_CHIPS = ['football', 'photography', 'coding', 'cooking', 'music'];
```

### 16.4 components/LandingScreen.jsx

```jsx
import { useState, useRef } from 'react';
import { VESSELS, PASSION_CHIPS } from '../config/vessels';

function Particles({ vessel }) {
  const isWine = vessel === 'wine';
  const color = isWine ? '#F2E8D5' : '#FF8A3D';
  const positions = [
    { left: '15%', bottom: '10%', delay: '0s' },
    { left: '50%', bottom: '20%', delay: '2s' },
    { left: '80%', bottom: '5%', delay: '4s' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {positions.map((p, i) => (
        <div
          key={i}
          className="float-particle"
          style={{
            position: 'absolute',
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: color,
          }}
        />
      ))}
    </div>
  );
}

function LandingScreen({ onSubmit, error, previewVessel, setPreviewVessel }) {
  const [passion, setPassion] = useState('');
  const [vessel, setVessel] = useState(null);
  const inputRef = useRef(null);

  const activeVessel = vessel || previewVessel || 'wine';
  const v = VESSELS[activeVessel];

  function handleChip(chip) {
    setPassion(chip);
    inputRef.current?.focus();
  }

  function handleVesselClick(chosenVessel) {
    setVessel(chosenVessel);
    setPreviewVessel(chosenVessel);
    if (passion.trim().length >= 2) {
      onSubmit(passion, chosenVessel);
    } else {
      inputRef.current?.focus();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (vessel && passion.trim().length >= 2) {
      onSubmit(passion, vessel);
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'background 0.4s ease',
        overflow: 'hidden',
      }}
    >
      <Particles vessel={activeVessel} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🍷🔥</div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond'",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(36px, 6vw, 48px)',
            color: v.parchment,
            margin: 0,
          }}
        >
          Passion Uncorked
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond'",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 22,
            color: v.parchment,
            opacity: 0.65,
            margin: '8px 0 40px',
          }}
        >
          Every passion is either aged or forged.
        </p>

        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            type="text"
            maxLength={60}
            placeholder='e.g. "open source"'
            aria-label="What are you passionate about"
            value={passion}
            onChange={(e) => setPassion(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 420,
              fontFamily: 'EB Garamond',
              fontSize: 20,
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${v.accentUi}`,
              borderRadius: 0,
              color: v.parchment,
              padding: '10px 4px',
              textAlign: 'center',
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            {Object.values(VESSELS).map((vesselOption) => {
              const selected = vessel === vesselOption.key;
              return (
                <button
                  key={vesselOption.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleVesselClick(vesselOption.key)}
                  onMouseEnter={() => setPreviewVessel(vesselOption.key)}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: 15,
                    padding: '12px 20px',
                    border: `1px solid ${selected ? vesselOption.primary : `${vesselOption.accentUi}66`}`,
                    borderRadius: 0,
                    background: selected ? vesselOption.primary : 'transparent',
                    color: selected ? vesselOption.parchment : vesselOption.parchment,
                    opacity: selected ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {vesselOption.label}
                </button>
              );
            })}
          </div>
        </form>

        {error && (
          <p
            className="fade-in"
            style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14, color: '#E74C3C', marginTop: 16 }}
          >
            {error}
          </p>
        )}

        <div style={{ marginTop: 40 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 11, opacity: 0.4, color: v.parchment, marginBottom: 10 }}>
            — Try these passions —
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {PASSION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChip(chip)}
                style={{
                  fontFamily: 'Inter',
                  fontSize: 13,
                  padding: '6px 14px',
                  border: `1px solid ${v.accentUi}66`,
                  borderRadius: 0,
                  background: 'transparent',
                  color: v.parchment,
                  opacity: 0.7,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          fontFamily: 'Inter',
          fontSize: 11,
          color: v.parchment,
          opacity: 0.28,
        }}
      >
        Powered by Google AI + ElevenLabs
      </div>
    </div>
  );
}

export default LandingScreen;
```

### 16.5 components/Label.jsx

```jsx
import { getAccentColor } from '../utils/colorMood';
import { wrapText } from '../utils/wrapText';
import { VESSELS } from '../config/vessels';
import Seal from './Seal';

function Label({ vessel, labelData, accentOverride = 'auto', backgroundImage }) {
  const f = VESSELS[vessel].fields;
  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);
  const isWine = vessel === 'wine';
  const bg = isWine ? '#F2E8D5' : '#C9BFB5';
  const ink = isWine ? '#2C1810' : '#3D3835';
  const rule = isWine ? '#B87333' : '#FF8A3D';
  const cornerRadius = isWine ? 3 : 0;
  const titleFont = isWine ? "'Cormorant Garamond'" : "'Cinzel'";

  const lines = wrapText(labelData[f.body], 33);

  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" role="img"
         className="label-card"
         style={{ width: '100%', height: 'auto', maxWidth: 400 }}
         aria-label={`${isWine ? 'Wine label' : 'Forge mark'} for passion: ${labelData[f.title]}`}>
      <defs>
        <filter id={`paper-${vessel}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>

      <rect width="400" height="560" fill={bg} filter={`url(#paper-${vessel})`} rx={cornerRadius}/>
      {backgroundImage && (
        <image
          href={backgroundImage}
          x="8" y="8" width="384" height="544"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.35"
          style={{ mixBlendMode: 'multiply' }}
        />
      )}
      <rect x="8" y="8" width="384" height="544" fill="none" stroke={accentColor} strokeWidth="2" rx={cornerRadius}/>
      <rect x="16" y="16" width="368" height="528" fill="none" stroke={accentColor} strokeWidth="0.75" rx={Math.max(cornerRadius - 1, 0)}/>

      <text x="200" y="62" textAnchor="middle" fontFamily={titleFont} fontSize="22" fontWeight="700"
            fontStyle={isWine ? 'italic' : 'normal'} letterSpacing={isWine ? 0 : 2} fill={accentColor}>
        {isWine ? `✦ ${labelData[f.title].toUpperCase()} ✦` : labelData[f.title].toUpperCase()}
      </text>

      <text x="200" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="13" fill={ink}>
        {labelData[f.subtitle]}
      </text>

      <line x1="40" y1="92" x2="360" y2="92" stroke={rule} strokeWidth="0.5"/>

      <text x="200" y="114" textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="12"
            fontWeight="600" letterSpacing="4" fill={ink}>
        {f.yearPrefix} · {labelData[f.year]}
      </text>

      <line x1="40" y1="126" x2="360" y2="126" stroke={rule} strokeWidth="0.5"/>

      <text x="40" y="148" fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.body}</text>
      {lines.map((line, i) => (
        <text key={i} x="40" y={164 + i * 16} fontFamily="EB Garamond" fontSize="12.5" fill={ink}>{line}</text>
      ))}

      <text x="40" y={220} fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.tag}</text>
      <text x="40" y={236} fontFamily="EB Garamond" fontSize="12" fill={ink}>{labelData[f.tag]}</text>

      <text x="40" y={262} fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.extra}</text>
      <text x="40" y={278} fontFamily="EB Garamond" fontSize="12" fill={ink}>{labelData[f.extra]}</text>

      <line x1="40" y1="295" x2="360" y2="295" stroke={rule} strokeWidth="0.5"/>

      <text x="40" y="314" fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.closer}</text>
      <text x="40" y="332" fontFamily="EB Garamond" fontSize="12" fontStyle="italic" fill={ink}>
        {labelData[f.closer]}
      </text>

      <Seal vessel={vessel} cx={200} cy={430} r={50} accentColor={accentColor} />
    </svg>
  );
}

export default Label;
```

### 16.6 components/Seal.jsx

```jsx
function Seal({ vessel, cx, cy, r, accentColor }) {
  const isWine = vessel === 'wine';
  return (
    <g className={isWine ? 'wax-seal' : 'ember-seal'} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill={accentColor} opacity={isWine ? 1 : 0.92} />
      {!isWine && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF8A3D" strokeWidth="2" opacity="0.6" />}
      <text x={cx} y={cy + 5} textAnchor="middle" fontFamily={isWine ? "'Cormorant Garamond'" : "'Cinzel'"}
            fontSize="14" fill={isWine ? '#F2E8D5' : '#1A1512'}>
        {isWine ? 'P · U' : '⚒'}
      </text>
    </g>
  );
}

export default Seal;
```

### 16.7 components/LoadingScreen.jsx

```jsx
import { useEffect, useMemo, useState } from 'react';
import { VESSELS } from '../config/vessels';

function LoadingScreen({ vessel, aiArtEnabled = false, reducedMotion = false }) {
  const v = VESSELS[vessel];
  const copy = useMemo(
    () => (aiArtEnabled ? [...v.loadingCopy, 'Painting the label…'] : v.loadingCopy),
    [v.loadingCopy, aiArtEnabled]
  );
  const [copyIndex, setCopyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopyIndex((i) => (i + 1) % copy.length);
    }, 900);
    return () => clearInterval(interval);
  }, [copy.length]);

  const isWine = vessel === 'wine';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isWine ? (
          <div
            className={reducedMotion ? '' : 'cork-pop'}
            style={{
              width: 24,
              height: 36,
              background: v.gold,
              borderRadius: '4px 4px 2px 2px',
            }}
          />
        ) : (
          <div
            className={reducedMotion ? '' : 'ember-pulse'}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: v.primary,
              boxShadow: `0 0 30px 10px ${v.primary}`,
            }}
          />
        )}
      </div>

      <p
        key={copyIndex}
        className={reducedMotion ? '' : 'fade-in'}
        style={{
          fontFamily: 'EB Garamond',
          fontStyle: 'italic',
          fontSize: 16,
          color: v.parchment,
          minHeight: 24,
        }}
      >
        {copy[copyIndex]}
      </p>

      <div style={{ width: 240, height: 2, background: `${v.accentUi}33`, overflow: 'hidden' }}>
        <div className={reducedMotion ? '' : 'progress-fill'} style={{ height: '100%', background: v.accentUi }} />
      </div>
    </div>
  );
}

export default LoadingScreen;
```

### 16.8 components/ResultScreen.jsx

```jsx
import { useEffect, useRef } from 'react';
import { VESSELS } from '../config/vessels';
import { getAccentColor } from '../utils/colorMood';
import { useTilt } from '../hooks/useTilt';
import VesselBottle from './VesselBottle';
import Label from './Label';
import Controls from './Controls';

function ResultScreen({
  vessel, passion, labelData, audioUrl, backgroundImage, vesselPhoto,
  accentOverride = 'auto', volume = 0.45, narrationEnabled = true,
  reducedMotion = false, onReset,
}) {
  const v = VESSELS[vessel];
  const labelRef = useRef(null);
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt({ max: 8, disabled: reducedMotion });

  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);

  useEffect(() => {
    if (!audioUrl || !narrationEnabled) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume; // Quiet auto-play — never jarring
    audio.play().catch(() => {}); // Silently swallow autoplay-policy errors; button still works
  }, [audioUrl, narrationEnabled, volume]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: 24,
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond'",
          fontStyle: 'italic',
          fontSize: 20,
          color: v.parchment,
          textAlign: 'center',
          margin: 0,
        }}
      >
        Your {vessel === 'wine' ? 'vintage' : 'forge mark'} of: <strong>{passion}</strong>
      </p>

      <div
        className="result-layout"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div className="vessel-silhouette" style={{ display: 'none' }}>
          {vesselPhoto ? (
            <img
              src={vesselPhoto}
              alt={vessel === 'wine' ? 'AI-generated photograph of the wine bottle' : 'AI-generated photograph of the forge mark'}
              className={reducedMotion ? '' : 'label-card'}
              style={{ width: 220, height: 'auto', maxHeight: 460, objectFit: 'cover', boxShadow: `0 12px 40px ${accentColor}33` }}
            />
          ) : (
            <VesselBottle
              vessel={vessel}
              accentColor={accentColor}
              intensityText={vessel === 'fire' ? labelData.intensity : undefined}
              reveal
              reducedMotion={reducedMotion}
            />
          )}
        </div>
        <div
          ref={(el) => { labelRef.current = el; tiltRef.current = el; }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="tilt-container"
          style={{ width: 'min(88vw, 340px)' }}
        >
          <Label vessel={vessel} labelData={labelData} accentOverride={accentOverride} backgroundImage={backgroundImage} />
        </div>
      </div>

      <Controls
        vessel={vessel}
        passion={passion}
        labelData={labelData}
        audioUrl={narrationEnabled ? audioUrl : null}
        volume={volume}
        labelRef={labelRef}
        onReset={onReset}
      />

      <style>{`
        @media (min-width: 900px) {
          .vessel-silhouette { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default ResultScreen;
```

### 16.9 components/Controls.jsx

```jsx
import { VESSELS } from '../config/vessels';
import { downloadLabel } from '../utils/download';
import { buildTwitterShareUrl } from '../utils/share';

function Controls({ vessel, passion, labelData, audioUrl, volume = 0.45, labelRef, onReset }) {
  const v = VESSELS[vessel];

  function handleReplay() {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  async function handleDownload() {
    await downloadLabel(labelRef, passion, vessel);
  }

  function handleShare() {
    const url = buildTwitterShareUrl(passion, vessel, labelData, window.location.href);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const buttonStyle = {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 14,
    padding: '10px 16px',
    border: `1px solid ${v.accentUi}`,
    borderRadius: 0,
    background: 'transparent',
    color: v.parchment,
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
      {audioUrl && (
        <button type="button" style={buttonStyle} onClick={handleReplay}>
          🔊 Replay
        </button>
      )}
      <button type="button" style={buttonStyle} onClick={handleDownload}>
        ⬇ Download
      </button>
      <button type="button" style={buttonStyle} onClick={handleShare}>
        🐦 Share on X
      </button>
      <button type="button" style={{ ...buttonStyle, borderColor: `${v.accentUi}66`, opacity: 0.7 }} onClick={onReset}>
        ↺ Try Another
      </button>
    </div>
  );
}

export default Controls;
```

### 16.10 hooks/useTilt.js

```javascript
import { useRef } from 'react';

// Plain pointer-driven 3D tilt — no animation library. Returns a ref to
// attach to the tilt container plus mouse handlers.
export function useTilt({ max = 10, disabled = false } = {}) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform =
      `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }

  return { ref, handleMouseMove, handleMouseLeave };
}
```

---

## 17. Utilities (Complete, Exact, Current)

### 17.1 utils/wrapText.js

```javascript
export function wrapText(str, maxChars = 33, maxLines = 3) {
  const words = (str || '').split(' ').filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  const consumed = lines.join(' ').length;
  const overflowed = words.join(' ').length > consumed;
  if (lines.length === maxLines && overflowed) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.slice(0, Math.max(maxChars - 1, 0)).trim() + '…';
  }

  return lines.slice(0, maxLines);
}
```

### 17.2 utils/download.js

```javascript
import html2canvas from 'html2canvas';

export async function downloadLabel(labelRef, passion, vessel) {
  const canvas = await html2canvas(labelRef.current, {
    scale: 3, backgroundColor: null, useCORS: true, logging: false, imageTimeout: 5000,
  });

  const filename = `passion-${vessel}-${passion.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25)}.png`;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
```

### 17.3 utils/colorMood.js

See §5.3 for the complete file.

### 17.4 utils/useLocalStorageState.js

```javascript
import { useState, useEffect } from 'react';

export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota) — settings just won't persist
    }
  }, [key, value]);

  return [value, setValue];
}
```

Used for both `settings` (key `passion-uncorked:settings`, object merged over defaults) and `gallery`
(key `passion-uncorked:gallery`, a capped array) — no special-casing needed in the hook itself, the
merge-vs-replace distinction is handled by the caller.

---

## 18. index.css — Every Keyframe (Complete, Exact, Current)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Wine */
  --wine-bg: #1A1209;
  --wine-parchment: #F2E8D5;
  --wine-burgundy: #6B1A2A;
  --wine-copper: #B87333;
  --wine-ink: #2C1810;
  --wine-bottle: #1C3A2B;
  --wine-gold: #D4AF37;

  /* Fire */
  --fire-bg: #1A1512;
  --fire-ash: #C9BFB5;
  --fire-ember: #E8531C;
  --fire-ember-bright: #FF8A3D;
  --fire-iron: #3D3835;
  --fire-anvil: #2A2622;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input {
  font-family: inherit;
  outline: none;
}

/* ---------- Animations (§5.7) ---------- */

@keyframes labelReveal {
  0%   { opacity: 0; transform: translateY(12px) rotateX(8deg) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) rotateX(0deg) scale(1); }
}
.label-card {
  animation: labelReveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}

@keyframes stampIn {
  0%   { transform: scale(2.8) rotate(-18deg); opacity: 0; }
  55%  { transform: scale(0.90) rotate(3deg);  opacity: 1; }
  75%  { transform: scale(1.06) rotate(-1deg); }
  100% { transform: scale(1)    rotate(0deg);  }
}
.wax-seal {
  animation: stampIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;
  transform-box: fill-box;
}

@keyframes emberBurn {
  0%   { opacity: 0; filter: brightness(3) blur(4px); transform: scale(1.3); }
  40%  { opacity: 1; filter: brightness(2) blur(1px); }
  100% { opacity: 1; filter: brightness(1) blur(0); transform: scale(1); }
}
.ember-seal {
  animation: emberBurn 0.65s ease-out 1.2s both;
  transform-box: fill-box;
}

@keyframes corkPop {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  40%  { transform: translateY(-60px) rotate(-20deg); opacity: 1; }
  70%  { transform: translateY(-80px) rotate(15deg); opacity: 0.7; }
  100% { transform: translateY(-40px) rotate(5deg); opacity: 0; }
}
.cork-pop {
  animation: corkPop 1.8s ease-in infinite;
}

@keyframes emberPulse {
  0%, 100% { opacity: 0.4; filter: brightness(1); }
  50%      { opacity: 1;   filter: brightness(1.6); }
}
.ember-pulse {
  animation: emberPulse 1.4s ease-in-out infinite;
}

@keyframes floatParticle {
  0%   { transform: translateY(0) translateX(0); opacity: 0.15; }
  50%  { transform: translateY(-30px) translateX(8px); opacity: 0.08; }
  100% { transform: translateY(-60px) translateX(-4px); opacity: 0; }
}
.float-particle {
  animation: floatParticle 6s ease-in-out infinite;
}

@keyframes labelSpin {
  0%, 100% { transform: rotateY(0deg); }
  50%      { transform: rotateY(12deg); }
}
.label-spin {
  animation: labelSpin 4s ease-in-out infinite;
}

@keyframes progressFill {
  from { width: 0%; }
  to   { width: 100%; }
}
.progress-fill {
  animation: progressFill 3.5s linear forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.fade-in {
  animation: fadeIn 0.3s ease-out both;
}

/* ---------- Vessel reveal animations (wine bottle + fire anvil) ---------- */

@keyframes liquidFill {
  0%   { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}
.liquid-fill {
  animation: liquidFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
  transform-origin: bottom;
  transform-box: fill-box;
}

@keyframes corkFlyReveal {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  35%  { transform: translateY(-70px) rotate(-25deg); opacity: 1; }
  70%  { transform: translateY(-95px) rotate(20deg); opacity: 0.6; }
  100% { transform: translateY(-120px) rotate(35deg); opacity: 0; }
}
.cork-fly-reveal {
  animation: corkFlyReveal 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) 0.9s both;
  transform-box: fill-box;
}

@keyframes glassShine {
  0%   { transform: translateX(-140px) skewX(-18deg); opacity: 0; }
  15%  { opacity: 0.5; }
  55%  { opacity: 0.3; }
  100% { transform: translateX(160px) skewX(-18deg); opacity: 0; }
}
.glass-shine {
  animation: glassShine 1.6s ease-out 1.1s both;
}

@keyframes flameFlicker {
  0%   { transform: scaleY(1) scaleX(1) skewX(0deg); }
  25%  { transform: scaleY(1.08) scaleX(0.96) skewX(-2deg); }
  50%  { transform: scaleY(0.94) scaleX(1.04) skewX(2deg); }
  75%  { transform: scaleY(1.05) scaleX(0.98) skewX(-1deg); }
  100% { transform: scaleY(1) scaleX(1) skewX(0deg); }
}
.flame-flicker {
  animation: flameFlicker 2.2s ease-in-out infinite;
  transform-origin: bottom;
  transform-box: fill-box;
}

@keyframes emberSparkRise {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.9; }
  100% { transform: translateY(-90px) translateX(var(--spark-drift, 6px)) scale(0.3); opacity: 0; }
}
.ember-spark {
  animation: emberSparkRise 1.6s ease-out infinite;
}

@keyframes hammerFlash {
  0%   { opacity: 0; transform: scale(0.6); }
  15%  { opacity: 1; transform: scale(1.4); }
  100% { opacity: 0; transform: scale(1.4); }
}
.hammer-flash {
  animation: hammerFlash 0.5s ease-out 1.05s both;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes shockwaveRing {
  0%   { opacity: 0.8; transform: scale(0.2); }
  100% { opacity: 0;   transform: scale(3); }
}
.shockwave-ring {
  animation: shockwaveRing 0.7s ease-out 1.05s both;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes bubbleRise {
  0%   { transform: translateY(0) scale(0.6); opacity: 0; }
  10%  { opacity: 0.55; }
  85%  { opacity: 0.35; }
  100% { transform: translateY(-260px) scale(1); opacity: 0; }
}
.wine-bubble {
  animation-name: bubbleRise;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

@keyframes meniscusWave {
  0%, 100% { transform: scaleX(1) translateY(0); }
  50%      { transform: scaleX(1.035) translateY(-1px); }
}
.liquid-meniscus {
  animation: meniscusWave 3s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes flameGlowPulse {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.08); }
}
.flame-glow {
  animation: flameGlowPulse 2.4s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes coreFlicker {
  0%, 100% { opacity: 0.85; transform: scaleY(1); }
  50%      { opacity: 1;    transform: scaleY(1.1); }
}
.flame-core {
  animation: coreFlicker 1.6s ease-in-out infinite;
  transform-origin: bottom;
  transform-box: fill-box;
}

@keyframes phaseFade {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
.phase-fade {
  animation: phaseFade 0.4s ease-out both;
}

.reduced-motion-hide {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .label-card, .wax-seal, .ember-seal, .cork-pop, .ember-pulse,
  .float-particle, .label-spin, .progress-fill,
  .liquid-fill, .cork-fly-reveal, .glass-shine, .flame-flicker,
  .ember-spark, .hammer-flash, .shockwave-ring, .phase-fade,
  .wine-bubble, .liquid-meniscus, .flame-glow, .flame-core {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

[data-motion="reduced"] .label-card,
[data-motion="reduced"] .wax-seal,
[data-motion="reduced"] .ember-seal,
[data-motion="reduced"] .cork-pop,
[data-motion="reduced"] .ember-pulse,
[data-motion="reduced"] .float-particle,
[data-motion="reduced"] .label-spin,
[data-motion="reduced"] .liquid-fill,
[data-motion="reduced"] .cork-fly-reveal,
[data-motion="reduced"] .glass-shine,
[data-motion="reduced"] .flame-flicker,
[data-motion="reduced"] .ember-spark,
[data-motion="reduced"] .hammer-flash,
[data-motion="reduced"] .shockwave-ring,
[data-motion="reduced"] .wine-bubble,
[data-motion="reduced"] .liquid-meniscus,
[data-motion="reduced"] .flame-glow,
[data-motion="reduced"] .flame-core {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

.tilt-container {
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
}

@keyframes slideInRight {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(0); }
}
.drawer-panel {
  animation: slideInRight 0.25s ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  .drawer-panel { animation: none !important; }
}
```

---

## 19. index.html — Open Graph + Meta Tags (exact current file)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Passion Uncorked — Every passion is either aged or forged.</title>

  <meta property="og:title" content="Passion Uncorked" />
  <meta property="og:description" content="Type what you love. Age it in wine or forge it in fire." />
  <meta property="og:image" content="https://passion-uncorked.vercel.app/og-image.png" />
  <meta property="og:url" content="https://passion-uncorked.vercel.app" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Passion Uncorked 🍷🔥" />
  <meta name="twitter:description" content="Every passion is either aged or forged. Which is yours?" />
  <meta name="twitter:image" content="https://passion-uncorked.vercel.app/og-image.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&family=EB+Garamond:ital,wght@0,400;1,400&family=Cinzel:wght@700&family=Oswald:wght@300;500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

`/public/og-image.png` (1200×630) still needs to be made from an actual screenshot once both vessels
are demoed — not yet generated as of this writing.

---

## 20. Build/Tooling Configuration (exact current files)

**`vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**`postcss.config.js`:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**`package.json` (exact current file):**
```json
{
  "name": "passion-uncorked",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@elevenlabs/elevenlabs-js": "^2.57.0",
    "@google/genai": "^2.11.0",
    "html2canvas": "^1.4.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.10"
  }
}
```

Note the departure from v1's "no bloat, raw fetch" philosophy for ElevenLabs: the official SDK is now
used (per explicit product decision), but its bundle-size cost is neutralized via lazy `import()`
(§8.1) rather than by avoiding the SDK — the measured outcome is the same lean initial bundle as the
raw-fetch approach, plus the SDK's typed, richer error objects.

**Known build-time cost:** because Vite/Rollup must still transform every module in
`@elevenlabs/elevenlabs-js` to produce the lazy chunk (even though it isn't part of the main bundle),
`npm run build` takes roughly 45–75 seconds instead of the ~5 seconds it took before this dependency was
added. This is a one-time developer-experience cost, not a runtime/user-facing one.

---

## 21. Environment Variables

```bash
# .env (never commit)
VITE_GEMINI_KEY=AQ...           # from https://aistudio.google.com → Get API Key
VITE_ELEVENLABS_KEY=sk_...      # from https://elevenlabs.io → Profile → API Keys

# .env.example (commit this)
VITE_GEMINI_KEY=
VITE_ELEVENLABS_KEY=
```

**Before assuming either key "isn't working," check these two settings pages directly, in this
order** (both were real, confirmed failure modes during this project, not hypotheticals):
1. **elevenlabs.io → Profile → API Keys → (your key) → usage limit.** If this is capped at 0 (which can
   happen independent of your account's actual plan/credits), every TTS request fails with
   `quota_exceeded` no matter how many real credits you have.
2. **Google AI Studio → your project's billing.** The free tier grants **zero** quota for every
   image-generation model — this is not a rate limit, `429 RESOURCE_EXHAUSTED` with `limit: 0` is
   returned immediately regardless of how few requests you've made. Text generation (`gemini-2.5-flash`)
   works fine on the free tier; image generation does not.

---

## 22. Vercel Deployment

```bash
git init
git add .
git commit -m "feat: Passion Uncorked — dual vessel, settings, gallery, ambient score"
git remote add origin https://github.com/[you]/passion-uncorked
git push -u origin main

# vercel.com → New Project → Import from GitHub → passion-uncorked
# Settings → Environment Variables:
#   VITE_GEMINI_KEY = [paste key]
#   VITE_ELEVENLABS_KEY = [paste key]
# Redeploy → live at passion-uncorked.vercel.app
```

Vite auto-detected. Build command: `vite build`. Output: `dist/`. No extra config needed — expect the
build step on Vercel to take the same ~45–75s the ElevenLabs SDK adds locally (§20).

---

## 23. Operational Findings Register (Replaces v1's speculative Risk Register)

Every row below is something that was actually hit and actually fixed during implementation — this
replaces v1's forward-looking risk table with a record of what really happened, so the same mistakes
aren't repeated in future work on this codebase.

| # | Finding | How it was diagnosed | Fix |
|---|---|---|---|
| 1 | `gemini-3.5-flash` (planned in v1) doesn't exist | Listed the account's real `/v1beta/models` | Switched to `gemini-2.5-flash`, confirmed live |
| 2 | Thinking model consumes entire token budget invisibly | `usageMetadata.thoughtsTokenCount` in the raw API response showed 300+ tokens spent with zero visible output | `thinkingConfig: { thinkingBudget: 0 }` |
| 3 | `@google/genai@0.7.0` silently drops `thinkingBudget` | Read the SDK's own compiled request-mapping code (`thinkingConfigToMldev`) — it only forwarded `includeThoughts` | Upgraded to `^2.11.0`, which forwards the whole object |
| 4 | Gemini occasionally returns truncated JSON even on `finishReason: STOP` | Captured and diffed multiple raw responses across a batch test | Repair-then-retry pipeline (§7.6) |
| 5 | ElevenLabs SDK's `play()` helper is Node-only | Vite's build log explicitly names `node:child_process`/`node:stream` being externalized from that exact file | Use `textToSpeech.convert()`'s `ReadableStream` + native `<audio>` instead |
| 6 | Eager SDK import bloats the bundle 6× | Measured `npm run build` output before/after | Dynamic `import()`, cached as a singleton promise |
| 7 | `vessels.js` used CSS-var strings, broken by alpha-suffix concatenation | Screenshot showed the nav bar rendering solid white instead of tinted | Switched every color in `vessels.js` to plain hex |
| 8 | Ambient audio was inaudible at the original default volume | Rendered the exact synthesis code through an `OfflineAudioContext` and measured peak amplitude (~0.04) | Raised default `ambientVolume` 0.18 → 0.6 (measured peak 0.131) |
| 9 | Gemini image models return zero quota on the free tier | Direct `429 RESOURCE_EXHAUSTED, limit: 0` against all 4 image-capable models on the account | `aiArtEnabled` defaults `false`, explicit UI note, graceful fallback |
| 10 | ElevenLabs key had a 0-credit **per-key** usage cap independent of the account plan | Read the exact `quota_exceeded` error body, which named the specific key and its configured limit | Documented as an account-settings fix, not a code fix |

---

## 24. Quality Checklist (v2, current status)

```
FUNCTIONALITY
[x] Landing → loading → result flow works, both vessels
[x] Vessel picker requires explicit choice, no default
[x] Passion chips fill input only, don't auto-submit
[x] Label renders correctly across many tested inputs, both vessels, both tones
[x] Each label has a unique accent colour from color_mood, or the manual override
[x] Audio plays correctly per vessel when ElevenLabs quota is available; replay button works
[x] Download produces 3× PNG with clean label, correct vessel in filename
[x] Share button opens correct, vessel-aware Twitter URL
[x] Reset returns to clean landing, vessel unset
[x] Error handling: bad API key / quota-exceeded shows a message, never crashes
[x] ElevenLabs failure: label still shows, audio button hides gracefully
[x] Gemini truncated-JSON quirk: repaired or retried transparently, verified across a paced batch
[x] Settings persist across reload (localStorage)
[x] Gallery persists across reload, revisiting costs zero API calls
[x] Ambient sound: mute/unmute, crossfade between vessels, verified via OfflineAudioContext render
[ ] AI artwork (background art + vessel photo): code complete and verified via build + fallback path;
    NOT verified end-to-end with live generation — blocked on a paid Gemini key (§12.3)

DESIGN
[x] No default blue anywhere in the app
[x] No white backgrounds visible (the one regression found — nav bar — was fixed, §5.2)
[x] Wax seal / ember seal animation looks crisp in both vessels
[x] Label text never overflows SVG bounds (wrapText handles this)
[x] Mobile layout tested at 375px, 390px
[x] prefers-reduced-motion AND the in-app Motion setting both respected on every animated element
[x] Refined wine bottle (foil capsule, bubbles, meniscus) and fire vessel (gradient flame, glow bloom,
    embers) verified via screenshot

SUBMISSION
[ ] Vercel URL live and publicly accessible
[ ] GitHub repo public with README
[ ] OG image renders on shared links (needs a real screenshot — not yet made)
[ ] DEV post published
[ ] Demo GIF embedded
[ ] At least 3 example artifacts screenshotted, both vessels, both tones
[ ] Prize categories section mentions both Google AI + ElevenLabs explicitly, plus the AI-artwork
    feature if a paid key becomes available before submission
```

---

*Passion Uncorked · Documentation FINAL v2 · reflects the actual implemented and tested codebase as of
this writing, not a build plan.*
*Every code block in this document is the exact, current contents of its corresponding file — if the
codebase and this document ever diverge, regenerate this document from the codebase, not the other way
around.*
