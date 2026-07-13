import { SKETCHFAB_MODELS, buildSketchfabEmbedUrl } from '../../config/sketchfab';

// Sketchfab embeds are heavy (a full WebGL viewer + model fetch from
// Sketchfab's servers). Recreating the <iframe> on every mount reloads it
// from scratch — and, empirically, so does simply MOVING the same iframe
// node to a different DOM parent: Chromium reloads an <iframe>'s content on
// reparenting even if it's never fully disconnected first. So each vessel's
// iframe lives in exactly one permanent DOM location, appended once and
// never moved again. Whichever on-screen panel currently "owns" it is
// tracked by syncing this fixed-position wrapper's rect/opacity/filter to
// that panel every frame, instead of physically relocating the iframe.

const wrappers = {}; // { wine: { wrapper, iframe } }
let layer;

function getLayer() {
  if (!layer) {
    layer = document.createElement('div');
    layer.style.cssText = 'position:fixed; top:0; left:0; width:0; height:0; overflow:visible; z-index:1;';
    document.body.insertBefore(layer, document.body.firstChild);
  }
  return layer;
}

// Sketchfab's own viewer initializes against whatever size the iframe has
// at load time — if it starts at 0×0 (created before the wrapper has a real
// rect) it fails to initialize WebGL correctly and never recovers even once
// resized, surfacing as either a blank frame or an explicit "Something went
// wrong with the 3D viewer" error. So the wrapper MUST be sized correctly
// (from a real, already-measured rect) before the iframe is ever created.
function createWrapper(vessel, rect) {
  const model = SKETCHFAB_MODELS[vessel];

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `position:fixed; overflow:hidden; visibility:hidden; background:#100c08;
    top:${rect.top}px; left:${rect.left}px; width:${rect.width}px; height:${rect.height}px;`;

  const iframe = document.createElement('iframe');
  iframe.src = buildSketchfabEmbedUrl(model.uid, { autospin: 0, backdrop: true });
  iframe.title = vessel === 'wine' ? 'Wine bottle 3D model' : 'Forge anvil 3D model';
  iframe.loading = 'lazy';
  iframe.tabIndex = -1;
  iframe.setAttribute('allow', 'autoplay; fullscreen; xr-spatial-tracking');
  // Matches the original .sketchfab-frame-viewport's `inset: -10% -14% -18% -14%`
  // (top right bottom left) — oversized and cropped by the wrapper's overflow:hidden,
  // to hide Sketchfab's own UI chrome around the edges.
  iframe.style.cssText = 'position:absolute; top:-10%; left:-14%; width:128%; height:128%; border:none; background:transparent;';

  wrapper.appendChild(iframe);
  getLayer().appendChild(wrapper);

  return { wrapper, iframe };
}

function getWrapperEntry(vessel, rect) {
  if (!wrappers[vessel] && rect) wrappers[vessel] = createWrapper(vessel, rect);
  return wrappers[vessel];
}

// Called every frame while a SketchfabFrame instance for this vessel is
// mounted — moves/resizes/re-tints the permanent wrapper to match wherever
// that instance's placeholder currently sits (including any GSAP transform).
export function syncSketchfabWrapper(vessel, { rect, opacity, filter, tint }) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return;
  const entry = getWrapperEntry(vessel, rect);
  if (!entry) return;
  const { wrapper } = entry;

  wrapper.style.top = `${rect.top}px`;
  wrapper.style.left = `${rect.left}px`;
  wrapper.style.width = `${rect.width}px`;
  wrapper.style.height = `${rect.height}px`;
  wrapper.style.visibility = 'visible';
  if (opacity != null) wrapper.style.opacity = opacity;
  if (filter != null) wrapper.style.filter = filter;

  let tintEl = wrapper.querySelector('.sketchfab-wrapper-tint');
  if (tint) {
    if (!tintEl) {
      tintEl = document.createElement('div');
      tintEl.className = 'sketchfab-wrapper-tint';
      tintEl.style.cssText = 'position:absolute; inset:0; mix-blend-mode:color; opacity:0.55; pointer-events:none;';
      wrapper.appendChild(tintEl);
    }
    tintEl.style.background = tint;
  } else if (tintEl) {
    tintEl.remove();
  }
}

export function hideSketchfabWrapper(vessel) {
  const entry = wrappers[vessel];
  if (entry) entry.wrapper.style.visibility = 'hidden';
}
