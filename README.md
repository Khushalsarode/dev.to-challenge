# 🍷🔥 Passion Uncorked

> Every passion is either aged or forged. Type yours.

A single-page app that transforms any passion into a hand-crafted vintage wine label or a forge
mark — written by Google Gemini, narrated by ElevenLabs, and scored by an original ambient music
theme composed entirely in the browser.

Type what you love → pick a vessel → get a beautiful, unique, narrated, downloadable artifact.
Under 30 seconds, no backend, no account required.

---

## Table of Contents

- [What it does](#what-it-does)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Settings reference](#settings-reference)
- [Known limitations](#known-limitations)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## What it does

1. Type anything you're passionate about — *football*, *open source*, *your cat*
2. Choose a vessel: **🍷 age it in wine**, or **🔥 forge it in fire**
3. Google Gemini generates a bespoke label — a fictional château or forge, tasting notes or temper
   notes, a rarity statement, a closing line — as structured JSON, in one call
4. ElevenLabs narrates it aloud — a warm sommelier's voice for wine, a grittier smith's voice for fire
5. An original, code-composed ambient music theme plays in the background, matching the vessel
6. Download the label as a high-res PNG, share it to X, or revisit it later from your local gallery

## Features

| | |
|---|---|
| 🍷🔥 **Dual vessel** | Every passion renders as either a vintage wine label or a forge mark — same input, two completely different artifacts |
| 🎭 **Classy / Sassy tone** | Switch Gemini's writing persona from warm and elegant to sharp, funny, affectionately roasting |
| 🎨 **Dynamic accent color** | Gemini returns a mood that drives the label's accent color — or override it manually to any of 8 palettes |
| 🔊 **Voice narration** | ElevenLabs reads the label aloud, with a per-vessel narrator you can swap in Settings |
| 🎵 **Ambient music score** | Two original looping compositions (Web Audio API, zero audio files) — a warm wine-cellar arpeggio and a driving forge ostinato |
| 🖼️ **AI artwork** *(requires a paid Gemini key)* | A real, photorealistic AI-generated photo of the bottle/forge mark, with the label's own text baked into the image |
| ⚙️ **Full settings panel** | Narration, volume, voice, ambient sound, motion, tone, creativity, accent override — all persisted locally |
| 🖼 **Local gallery** | Every generation is saved automatically; revisiting one is instant and free — no new API call |
| ♿ **Accessibility** | Full keyboard navigation, ARIA labeling, and `prefers-reduced-motion` support (plus an in-app Motion toggle) |
| 📱 **Responsive** | Side-by-side on desktop, stacked on tablet, thumb-friendly controls on mobile |

## Tech stack

- **React 18 + Vite 5** — frontend, no framework backend
- **Google Gemini 2.5 Flash** (`@google/genai`) — label content generation (structured JSON) and,
  optionally, AI artwork generation (`gemini-2.5-flash-image`)
- **ElevenLabs** (`@elevenlabs/elevenlabs-js`, lazy-loaded) — voice narration
- **Web Audio API** — original synthesized ambient music, no audio files or libraries
- **html2canvas** — high-resolution PNG export
- **localStorage** — settings and gallery persistence, no server/database
- **Vercel** — zero-config static deployment

## Getting started

```bash
git clone <this-repo>
cd passion-uncorked
npm install
cp .env.example .env
```

Add your API keys to `.env` (see [Environment variables](#environment-variables)), then:

```bash
npm run dev
```

Open the printed local URL. Type a passion, pick a vessel, and generate your first label.

## Environment variables

```bash
# .env — never commit this file
VITE_GEMINI_KEY=your_gemini_key_here
VITE_ELEVENLABS_KEY=your_elevenlabs_key_here
```

| Key | Where to get it | Notes |
|---|---|---|
| `VITE_GEMINI_KEY` | [aistudio.google.com](https://aistudio.google.com) → **Get API Key** | Free tier works for label generation. AI artwork needs a **paid** project — the free tier grants zero image-generation quota. |
| `VITE_ELEVENLABS_KEY` | [elevenlabs.io](https://elevenlabs.io) → **Profile → API Keys** | Free tier includes 10k characters/month. Check the key's own **usage limit** if narration fails with a quota error — it can be capped independently of your plan. |

`.env.example` is committed with empty values as a template.

## Project structure

```
passion-uncorked/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                  # Root state machine
│   ├── main.jsx                 # Entry point, wraps App in SettingsProvider
│   ├── index.css                # Global styles + every animation keyframe
│   │
│   ├── config/
│   │   └── vessels.js           # Palette, fonts, copy, field map per vessel
│   ├── context/
│   │   └── SettingsContext.jsx  # Global settings (localStorage-persisted)
│   ├── hooks/
│   │   └── useTilt.js           # 3D pointer-tilt hook for the label card
│   │
│   ├── components/
│   │   ├── LandingScreen.jsx    # Hero, input, vessel picker, passion chips
│   │   ├── LoadingScreen.jsx    # Vessel-themed animation + cycling copy
│   │   ├── ResultScreen.jsx     # Label + bottle/anvil (or AI photo) + controls
│   │   ├── VesselBottle.jsx     # Animated SVG bottle / anvil
│   │   ├── Label.jsx            # The SVG label itself
│   │   ├── Seal.jsx             # Wax seal (wine) / ember seal (fire)
│   │   ├── Controls.jsx         # Replay, Download, Share, Reset
│   │   ├── NavBar.jsx           # Persistent top bar
│   │   ├── Drawer.jsx           # Shared slide-in panel primitive
│   │   ├── SettingsPanel.jsx    # Settings drawer
│   │   └── GalleryPanel.jsx     # History drawer
│   │
│   ├── services/
│   │   ├── gemini.js            # Label generation (tone/temperature aware)
│   │   ├── elevenlabs.js        # Narration + voice listing
│   │   ├── imagegen.js          # AI artwork (gated, requires paid key)
│   │   └── ambientSound.js      # Original music synthesis
│   │
│   └── utils/
│       ├── colorMood.js         # AI mood → accent hex
│       ├── wrapText.js          # SVG text line-wrapping
│       ├── download.js          # PNG export
│       ├── share.js             # X/Twitter share link builder
│       └── useLocalStorageState.js
│
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Settings reference

Everything below lives in the ⚙ Settings drawer and persists across reloads.

| Setting | Default | What it controls |
|---|---|---|
| Narration | On | Whether ElevenLabs is called at all |
| Volume | 45% | Playback volume for narration |
| Wine / Fire narrator | Default (Adam / Josh) | Pick any premade ElevenLabs voice on your account |
| Ambient sound | Off | The background music score (off by default — autoplay requires a click) |
| Ambient volume | 60% | Music loudness |
| Motion | Full | Reduces/disables animation, independent of OS-level `prefers-reduced-motion` |
| Tone | Classy | Switch Gemini's writing persona to Sassy for a wittier, roast-style label |
| Creativity | 1.10 | Gemini's generation temperature (0.7–1.4) |
| Accent color | Auto (from AI) | Manually pin the label's accent instead of using the AI-chosen mood |
| AI artwork | Off | Real photo generation for the label background + bottle/forge — **requires a paid Gemini key** |

## Known limitations

These are platform/account constraints, not bugs:

- **AI artwork requires a paid Gemini key.** The Gemini free tier grants **zero** quota for every
  image-generation model — confirmed directly against the API, not a rate limit that resets. The
  feature is fully built and gated off by default; flip it on in Settings once billing is enabled on
  your Google AI Studio project.
- **ElevenLabs keys can carry their own usage cap.** If narration fails with a quota error even though
  your account has credits, check **Profile → API Keys → (your key) → usage limit** on elevenlabs.io —
  it can be capped at 0 independently of your actual plan.
- **`gemini-2.5-flash` is a "thinking" model.** The app already disables its internal reasoning pass
  (`thinkingConfig.thinkingBudget: 0`) — without this, the model can silently consume its entire output
  budget on invisible reasoning and return nothing.

## Scripts

```bash
npm run dev       # start the Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Deployment

Deploys cleanly to [Vercel](https://vercel.com) with zero configuration:

1. Push this repo to GitHub
2. **Vercel → New Project → Import** your repo
3. Add `VITE_GEMINI_KEY` and `VITE_ELEVENLABS_KEY` under **Settings → Environment Variables**
4. Deploy — Vite is auto-detected, build command `vite build`, output `dist/`

---

Built for **DEV Weekend Challenge: Passion Edition**.
