# Passion Uncorked

<p align="center">
  <a href="https://passion-uncorked.vercel.app">
    <img src="./public/demo.gif" alt="Passion Uncorked — type a passion, pick wine or fire, get a narrated label" width="920" />
  </a>
</p>

<p align="center">
  <strong>Type any passion → age it in wine or forge it in fire → narrated label in under 30s.</strong><br />
  <a href="https://passion-uncorked.vercel.app">Live demo</a> · Gemini labels · ElevenLabs voice · browser ambient score
</p>

---

## Screenshots

<p align="center">
  <img src="./public/workflow/step-1-landing.png" alt="Landing — type your passion and pick a vessel" width="300" />
  &nbsp;&nbsp;
  <img src="./public/workflow/step-2-loading.png" alt="Loading — vessel-themed generation" width="300" />
  &nbsp;&nbsp;
  <img src="./public/workflow/step-3-result.png" alt="Result — downloadable narrated label" width="300" />
</p>

| | | |
|:---:|:---:|:---:|
| **Landing** | **Loading** | **Result** |
| Dual 3D showcase + vessel picker | Full-page mood + progress | Label between bottle & anvil |

---

## What you get

- **Wine or fire** — same passion, two completely different artifacts
- **AI copy** — Gemini writes the château / forge details as structured JSON
- **Narration** — ElevenLabs reads it aloud (per-vessel voice)
- **Download & share** — high-res PNG export + X share link
- **Local gallery** — every generation saved in the browser

---

## Run locally

```bash
git clone https://github.com/Khushalsarode/dev.to-challenge.git
cd dev.to-challenge
npm install
cp .env.example .env   # add VITE_GEMINI_KEY + VITE_ELEVENLABS_KEY
npm run dev
```

| Key | Get it |
|---|---|
| `VITE_GEMINI_KEY` | [Google AI Studio](https://aistudio.google.com) |
| `VITE_ELEVENLABS_KEY` | [ElevenLabs](https://elevenlabs.io) → Profile → API Keys |

<details>
<summary><strong>More details (if you actually read READMEs)</strong></summary>

### Stack
React 18 · Vite · Gemini · ElevenLabs · Web Audio API · html2canvas · localStorage

### Deploy
Push to GitHub → [Vercel](https://vercel.com) import → add the two env vars → deploy.

### Notes
- AI artwork needs a **paid** Gemini key (free tier = zero image quota)
- ElevenLabs keys can have their own usage cap independent of plan credits

</details>

---

Built for **DEV Weekend Challenge: Passion Edition**.
