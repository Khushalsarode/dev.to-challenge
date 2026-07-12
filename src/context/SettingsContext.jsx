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
