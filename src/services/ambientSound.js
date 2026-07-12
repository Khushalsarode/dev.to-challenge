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
