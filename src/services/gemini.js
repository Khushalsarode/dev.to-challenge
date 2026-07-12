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
