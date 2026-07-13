import { useEffect, useState } from 'react';
import LandingScreen from './components/LandingScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import NavBar from './components/NavBar';
import SettingsPanel from './components/SettingsPanel';
import GalleryPanel from './components/GalleryPanel';
import MoodBackground from './components/MoodBackground';
import { generateLabelData } from './services/gemini';
import { generateVoiceAudio } from './services/elevenlabs';
import { generateBackgroundArt, generateVesselPhoto } from './services/imagegen';
import { getAccentColor } from './utils/colorMood';
import { VESSELS } from './config/vessels';
import { useSettings } from './context/SettingsContext';
import { useLocalStorageState } from './utils/useLocalStorageState';
import { startAmbient, setAmbientVolume, getCurrentAmbientVessel } from './services/ambientSound';

const GALLERY_CAP = 20;

function resolveVibeIntensity(phase, previewVessel, vessel) {
  if (phase === 'loading') return 'loading';
  if (phase === 'result') return 'result';
  if (previewVessel) return 'hover';
  if (vessel && phase === 'landing') return 'selected';
  return 'idle';
}

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
  const vibeIntensity = resolveVibeIntensity(phase, previewVessel, vessel);
  const resultMoodColor = phase === 'result' && labelData
    ? getAccentColor(vessel, settings.accentOverride !== 'auto' ? settings.accentOverride : labelData.color_mood)
    : null;

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
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <div
      data-motion={reducedMotion ? 'reduced' : 'full'}
      className="app-shell"
      data-vessel={activeVessel}
      data-vibe={vibeIntensity}
      data-phase={phase}
    >
      <MoodBackground
        vessel={activeVessel}
        intensity={vibeIntensity}
        reducedMotion={reducedMotion}
        moodColor={resultMoodColor}
        global
      />

      <NavBar
        vessel={vessel || previewVessel}
        onReset={handleReset}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenGallery={() => setGalleryOpen(true)}
        galleryCount={gallery.length}
      />

      <div className="app-content">
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
