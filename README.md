# 🍷🔥 Passion Uncorked

> Every passion is either aged or forged. Type yours.

A single-page app that transforms any passion into a hand-crafted
vintage wine label or a forge mark — powered by Google Gemini and
voiced by ElevenLabs.

## What it does

1. Type anything you're passionate about (football, open source, your cat)
2. Choose a vessel: age it in wine, or forge it in fire
3. Google Gemini generates a bespoke artifact in under 2 seconds
4. ElevenLabs voices it — a sommelier for wine, a smith for fire
5. Download as a high-res PNG or share it on X

## Tech Stack

- **React 18 + Vite** — frontend
- **Google Gemini** — AI content generation (structured JSON)
- **ElevenLabs eleven_flash_v2_5** — voice narration, vessel-specific
- **html2canvas** — PNG export
- **Vercel** — deployment

## Running Locally

```bash
npm install
cp .env.example .env
# Add your keys to .env:
# VITE_GEMINI_KEY=your_key_here
# VITE_ELEVENLABS_KEY=your_key_here
npm run dev
```

Get your API keys:
- **Gemini:** https://aistudio.google.com → Get API Key (free)
- **ElevenLabs:** https://elevenlabs.io → Profile → API Keys (free: 10k chars/month)

## Built for DEV Weekend Challenge: Passion Edition
