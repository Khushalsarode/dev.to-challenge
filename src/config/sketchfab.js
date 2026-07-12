export const SKETCHFAB_MODELS = {
  wine: {
    uid: 'f0d2cba161a844d2944ec8f7e3509d52',
    credit: 'Marco De Simone',
    creditUrl: 'https://sketchfab.com/marcodesimone888',
    license: 'CC Attribution',
  },
  fire: {
    uid: 'e63f1154ee0b41f8a797db683526142a',
    credit: 'Aparicio Silva 3D',
    creditUrl: 'https://sketchfab.com/apariciosilva3D',
    license: 'CC Attribution',
  },
};

export function buildSketchfabEmbedUrl(uid, { autospin = 0, backdrop = false } = {}) {
  const params = new URLSearchParams({
    autostart: '1',
    preload: '1',
    transparent: '1',
    autospin: String(autospin),
    camera: '0',
    scrollwheel: backdrop ? '1' : '0',
    ui_animations: '0',
    ui_controls: '0',
    ui_infos: '0',
    ui_stop: '0',
    ui_watermark: '0',
    ui_inspector: '0',
    ui_ar: '0',
    ui_help: '0',
    ui_settings: '0',
    ui_vr: '0',
    ui_annotations: '0',
    ui_fullscreen: '0',
    ui_theme: 'dark',
  });
  return `https://sketchfab.com/models/${uid}/embed?${params.toString()}`;
}
