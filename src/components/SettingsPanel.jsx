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
