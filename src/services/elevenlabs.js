const VOICE_IDS = {
  wine: 'pNInz6obpgDQGcFmaJgB', // Adam — premade, free tier
  fire: 'VR6AewLTigWG4xSOukaG', // Arnold — premade, free tier (Josh is library-only, 402s on free tier)
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
