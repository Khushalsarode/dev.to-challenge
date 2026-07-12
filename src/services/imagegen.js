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
